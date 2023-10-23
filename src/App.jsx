/* eslint-disable no-import-assign */
import { useCallback, useState, useRef } from "react";
import { Map, Marker } from "react-amap";
import { wgs84togcj02 } from "coordtransform";
import { DeckGL } from "deck.gl";
import "./App.css";

const DEFAULT_CENTER = [114.18088588361525, 30.55405768340087];
const DEFAULT_ZOOM = 11;

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: DEFAULT_CENTER[0],
  latitude: DEFAULT_CENTER[1],
  zoom: DEFAULT_ZOOM,
  maxPitch: 85,
  pitch: 0,
  bearing: 0,
};
function linkAMap(map, { zoom, center, pitch, bearing }) {
  const mapboxZoom = zoom + 1;
  const mapboxPitch = pitch + 1;
  const mapboxCenter = center;
  const amapRotate = -bearing;
  map.setZoom(mapboxZoom);
  map.setPitch(mapboxPitch);
  map.setCenter(wgs84togcj02(mapboxCenter[0], mapboxCenter[1]), false);
  map.setRotation(amapRotate);
}

function App() {
  const [markerDragging, setMarkerDragging] = useState(false);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const amapRef = useRef(null);
  const handleDeckViewState = useCallback(
    (viewState) => {
      const { latitude, longitude, zoom, pitch, bearing } = viewState.viewState;
      if (markerDragging) {
        return;
      }
      setViewState(viewState.viewState);
      if (amapRef.current) {
        linkAMap(amapRef.current, {
          zoom,
          center: [longitude, latitude],
          pitch,
          bearing,
        });
      }
    },
    [markerDragging]
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <DeckGL
        initialViewState={markerDragging ? undefined : viewState}
        viewState={markerDragging ? viewState : undefined}
        controller={true}
        onViewStateChange={handleDeckViewState}
      >
        <Map
          amapkey={import.meta.env.AMAP_TOKEN}
          dragEnable={false}
          version="2.0"
          viewMode="3D"
          features={["bg", "point", "road"]}
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM + 1}
          events={{
            created: (instance) => {
              amapRef.current = instance;
            },
          }}
        >
          <Marker
            position={DEFAULT_CENTER}
            draggable
            onMouseD
            events={{
              dragging: (event) => {
                event.originEvent.stopPropagation();
                // console.log("dragging", event);
              },
              dragend: (event) => {
                event.originEvent.stopPropagation();
                // console.log("dragstart", event);
                setMarkerDragging(false);
              },
              dragstart: (event) => {
                setMarkerDragging(true);
                event.originEvent.stopPropagation();
                // console.log("dragstart", event);
              },
            }}
          />
        </Map>
      </DeckGL>
    </div>
  );
}

export default App;
