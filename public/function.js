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
                updateGeoJson(window.map.getZoom());
            });
        }
    }, 500);
};

let currentJsonFile = null; // 중복 요청 방지
let previousZoomLevel = null; // 이전 줌 레벨 저장

function updateGeoJson(zoomLevel) {
    if (!window.map) return;

    let jsonFile = "";
    if (zoomLevel <= 10) {
        jsonFile = "/gysi_wgs84.geojson";
    } else if (zoomLevel <= 12) {
        jsonFile = "/si_wgs84.geojson";
    } else {
        clearMapData(); // 모든 폴리곤 제거 (줌 레벨 13 이상)
        currentJsonFile = null; // 폴리곤 제거 시 currentJsonFile 초기화
        return;
    }

      // 이전 줌 레벨이 12 초과였다가 12 이하로 내려왔을 경우, 강제적으로 다시 로드
      if (previousZoomLevel > 12 && zoomLevel <= 12) {
        currentJsonFile = null;
    }
    previousZoomLevel = zoomLevel; // 현재 줌 레벨을 기록

    // 중복 요청 방지
    if (jsonFile === currentJsonFile) return;
    currentJsonFile = jsonFile;

    clearMapData(); // 기존 폴리곤 제거

    fetch(jsonFile)
        .then((response) => response.json())
        .then((json) => {
            if (!json || !json.features) return;

            clearMapData(); // 기존 데이터 삭제 후 추가

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
        })
        .catch((error) => console.error(`GeoJSON 로드 실패`, error));
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

// Hover & Click 이벤트 추가 함수
function addPolygonEvents() {
    let selectedFeature = null;

    window.map.data.addListener("mouseover", function (event) {
        if (event.feature !== selectedFeature) {
            window.map.data.overrideStyle(event.feature, {
                fillOpacity: 0.8,
            });
        }
    });

    window.map.data.addListener("mouseout", function (event) {
        if (event.feature !== selectedFeature) {
            window.map.data.revertStyle(event.feature);
        }
    });

    // 클릭하면 지도 중심 이동
    window.map.data.addListener("click", function (event) {
        if (selectedFeature) {
            window.map.data.revertStyle(selectedFeature);
        }
        selectedFeature = event.feature;
        window.map.data.overrideStyle(event.feature, {
            fillOpacity: 0.8,
        });

        const regionCode = event.feature.getProperty("CTPRVN_CD");

        if (regionCode === "11") {
            window.map.setCenter(new naver.maps.LatLng(37.5665, 126.9780)); // 서울
            window.map.setZoom(11);
        } else if (regionCode === "28") {
            window.map.setCenter(new naver.maps.LatLng(37.4565, 126.7052)); // 인천
            window.map.setZoom(11);
        }
    });
}
