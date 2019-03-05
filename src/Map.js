import React, { PureComponent } from "react";
import { Map, Marker, Popup, TileLayer, Circle } from "react-leaflet";

class MapContainer extends PureComponent {
  map = null;

  state = {
    center: [51.21, 4.419],
    zoom: 13
  };

  componentDidMount() {
    setTimeout(() => {
      if (this.map) {
        this.map.leafletElement.invalidateSize();
      }
    }, 700);
  }

  componentWillReceiveProps(nextProps) {
    const { highlighted } = this.props;
    if (highlighted !== nextProps.highlighted) {
      this.setState({
        center: [nextProps.highlighted.lat, nextProps.highlighted.lng],
        zoom: 18
      });
    }
  }

  render() {
    const { schools, homeLocation, setHomeLocation, highlighted } = this.props;
    const { center, zoom } = this.state;

    return (
      <Map
        center={center}
        zoom={zoom}
        ref={r => (this.map = r)}
        onContextMenu={e => {
          setHomeLocation(e.latlng);
          this.setState({
            center: e.latlng,
            zoom: 15
          });
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {schools.map((school, k) => (
          <Marker
            position={[school.lat, school.lng]}
            key={`${school.lat}${school.lng}${k}`}
            open={school === highlighted}
          >
            <Popup>
              <h1>{school.name}</h1>
              <p>
                {school.distance ? (
                  <span>
                    <strong>Afstand: </strong>
                    {school.distance}m<br />
                  </span>
                ) : null}
                <strong>Indicator: </strong> {school.indicator}
                <br />
                <strong>Niet-indicator: </strong> {school.notIndicator}
                <br />
                <strong>Afstands%: </strong> {school.distancePercent}
                <br />
              </p>
            </Popup>
          </Marker>
        ))}

        {homeLocation
          ? [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(radius => (
              <Circle center={homeLocation} radius={radius} key={radius} />
            ))
          : null}
      </Map>
    );
  }
}

export default MapContainer;
