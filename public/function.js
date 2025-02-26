window.onload = function () {
    if (!window.naver || !window.naver.maps) {
        return;
    }

    const waitForMap = setInterval(() => {
        if (window.map) {
            clearInterval(waitForMap);

            // 초기 줌 레벨 설정
            window.map.setZoom(10);
            updateGeoJson(window.map.getZoom());

            // 줌 변경 이벤트 리스너 등록
            naver.maps.Event.addListener(window.map, "zoom_changed", function () {
                const newZoomLevel = window.map.getZoom();
                if (newZoomLevel !== previousZoomLevel) {
                    previousZoomLevel = newZoomLevel;
                    updateGeoJson(newZoomLevel);
                }
            });
        }
    }, 500);
};

let currentJsonFile = null; // 중복 요청 방지
let previousZoomLevel = null; // 이전 줌 레벨 저장
let selectedFeature = null; // 선택된 Feature

// 행정구역 중심 좌표 저장 객체
const regionCenters = {
    "옹진군": { lat: 37.263572, lng: 126.449816 }, // 영흥도 중심 좌표
    "서울 중구": { lat: 37.5636, lng: 126.9976 }, // 서울 중구
    "인천 중구": { lat: 37.4602, lng: 126.4407 } // 인천 중구
};

function updateGeoJson(zoomLevel) {
    if (!window.map) return;

    let jsonFile = "";
    if (zoomLevel <= 10) {
        jsonFile = "/gysi_wgs84.geojson";
    } else if (zoomLevel <= 12) {
        jsonFile = "/si_wgs84.geojson";
    } else {
        clearMapData(); // 모든 폴리곤 제거 (줌 레벨 13 이상)
        currentJsonFile = null;
        return;
    }

    // 이전 줌 레벨이 12 초과였다가 12 이하로 내려왔을 경우, 강제적으로 다시 로드
    if (previousZoomLevel > 12 && zoomLevel <= 12) {
        clearMapData(); // si_wgs84.geojson 데이터도 삭제 후 다시 불러오기
        currentJsonFile = null;
    }
    previousZoomLevel = zoomLevel; // 현재 줌 레벨을 기록

    // 중복 요청 방지
    if (jsonFile === currentJsonFile) return;
    currentJsonFile = jsonFile;

    // 폴리곤을 삭제하고 잠시 후 새 데이터를 로드
    clearMapData();
    setTimeout(() => {
        fetch(jsonFile)
            .then(response => response.json())
            .then(json => {
                if (!json || !json.features) return;

                window.map.data.addGeoJson(json);

                // 폴리곤 스타일 적용
                window.map.data.setStyle(feature => ({
                    fillColor: "#fef399",
                    fillOpacity: 0.3,
                    strokeWeight: 2,
                    strokeColor: "#333",
                    strokeOpacity: 1,
                }));

                addPolygonEvents(); // Hover & Click 이벤트 추가

                // GeoJSON 데이터를 기반으로 중심 좌표 저장
            json.features.forEach(feature => {
                const name = feature.properties.SIG_KOR_NM; // 행정구역 이름
                if (!regionCenters[name]) { // 이미 등록된 지역은 제외
                    const coordinates = feature.geometry.coordinates[0][0]; // 첫 번째 폴리곤 좌표
                    const centroid = findCentroid(coordinates);
                    regionCenters[name] = { lat: centroid[1], lng: centroid[0] }; // 위도, 경도 저장
                }
            });


            })
            .catch(error => console.error(`GeoJSON 로드 실패`, error));
    }, 200); // 폴리곤 제거 후 200ms 후에 로드하여 중첩 방지
}

// 기존 폴리곤 삭제 함수
function clearMapData() {
    const featuresToRemove = [];
    window.map.data.forEach(feature => {
        if (feature) featuresToRemove.push(feature);
    });

    featuresToRemove.forEach(feature => {
        try {
            window.map.data.removeFeature(feature);
        } catch (error) {}
    });
}

// 무게 중심(중앙 좌표) 계산 함수
function findCentroid(coords) {
    let x = 0, y = 0, area = 0;

    for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
        let p1 = coords[i];
        let p2 = coords[j];

        let f = p1[0] * p2[1] - p2[0] * p1[1];
        x += (p1[0] + p2[0]) * f;
        y += (p1[1] + p2[1]) * f;
        area += f * 3;
    }

    return [x / area, y / area]; // [경도, 위도] 반환
}

// Hover & Click 이벤트 추가 함수
function addPolygonEvents() {
    let infoWindow = new naver.maps.InfoWindow({
        disableAnchor: true,
        backgroundColor: "#ffffff",
        maxWidth: 70,
        borderColor: "#333",
        borderWidth: 1,
        anchorSize: new naver.maps.Size(10, 10),
        pixelOffset: new naver.maps.Point(0, -10)
    });

    window.map.data.addListener("mouseover", function (event) {
        if (event.feature !== selectedFeature) {
            window.map.data.overrideStyle(event.feature, {
                fillOpacity: 0.8,
            });
        }

        const zoomLevel = window.map.getZoom();
        let regionName = zoomLevel <= 10 ? event.feature.getProperty("CTP_KOR_NM") :
                         zoomLevel <= 12 ? event.feature.getProperty("SIG_KOR_NM") : null;

        if (regionName) {
            infoWindow.setContent(`<div style="padding:5px;font-size:12px;">${regionName}</div>`);
            infoWindow.open(window.map, event.coord);
        }
    });

    window.map.data.addListener("mouseout", function (event) {
        if (event.feature !== selectedFeature) {
            window.map.data.revertStyle(event.feature);
        }
        infoWindow.close();
    });

    // 클릭하면 지도 중심 이동 및 확대
    window.map.data.addListener("click", function (event) {
        const zoomLevel = window.map.getZoom();
        const regionName = event.feature.getProperty("SIG_KOR_NM");
        const regionCode = event.feature.getProperty("SIG_CD");
        const cityName = event.feature.getProperty("CTP_KOR_NM");
        const regionPrefix = regionCode ? regionCode.substring(0, 2) : "";

        // 이전 선택된 Feature 스타일 초기화
        if (selectedFeature) {
            window.map.data.revertStyle(selectedFeature);
        }
        selectedFeature = event.feature;
        window.map.data.overrideStyle(event.feature, {
            fillOpacity: 0.8,
        });

        if (regionName === "중구") {
            if (regionPrefix === "11") {
                window.map.setCenter(new naver.maps.LatLng(37.5636, 126.9976)); // 서울 중구 중심 좌표
            } else if (regionPrefix === "28") {
                window.map.setCenter(new naver.maps.LatLng(37.4602, 126.4407)); // 인천 중구 중심 좌표
            }
            window.map.setZoom(13);

        } 
        
        else if (cityName === "서울특별시" || cityName === "인천광역시") {
            // 서울, 인천은 11레벨까지만 확대
            if (cityName === "서울특별시") {
                window.map.setCenter(new naver.maps.LatLng(37.5665, 126.9780)); // 서울
            } else if (cityName === "인천광역시") {
                window.map.setCenter(new naver.maps.LatLng(37.4565, 126.7052)); // 인천
            }
            window.map.setZoom(11);

        } 
        else if (regionCenters[regionName]) {
            const { lat, lng } = regionCenters[regionName];
            window.map.setCenter(new naver.maps.LatLng(lat, lng));
            window.map.setZoom(13);
        }  
        else {
            if (selectedFeature) {
                window.map.data.revertStyle(selectedFeature);
            }
            selectedFeature = event.feature;
            window.map.data.overrideStyle(event.feature, {
                fillOpacity: 0.8,
            });
        }

        setTimeout(() => {
            window.scrollTo({
                top: 180,
                behavior: "smooth",
            });
        }, 100);

        if (zoomLevel <= 13) {
            infoWindow.close();
        }
    });
}
