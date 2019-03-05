import React, { Component } from "react";
import { Alert } from "antd";
import Map from "./Map";
import List from "./List";
import Filter from "./Filter";
import styled from "styled-components";
import schools from "./data/data.json";
import geolib from "geolib";

import "./index.css";
import { max } from "moment";

const Container = styled.div`
  @media (min-width: 900px) {
    display: flex;
    height: 100vh;
    width: 100vw;
  }

  height: 100vh;
  width: 100vw;
`;

const MobileNav = styled.div`
  @media (min-width: 900px) {
    display: none;
  }

  position: fixed;
  top: 0;
  right: 0;

  background-color: white;
  z-index: 10001;
  max-width: 70vw;
  font-size: 20px;
  padding: 5px;
`;

const Right = styled.div`
  width: 100vw;
  heigth: 100vh;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  z-index: ${props => (props.force ? 10000 : -1)};
  @media (min-width: 900px) {
    width: 40vw;
    z-index: 1;
    position: static;
  }
`;

const Help = styled.div`
  padding: 10px;
  padding-top: 30px;
  @media (min-width: 900px) {
    padding: 10px;
  }
`;

const distanceCache = {};

const getDistance = (a, b) => {
  const k = `${a.latitude}:${b.latitude}:${a.longitude}:${b.longitude}`;
  if (!distanceCache[k]) {
    distanceCache[k] = Math.round(geolib.getDistance(a, b));
  } else {
    console.log("cache hit");
  }

  return distanceCache[k];
};

class App extends Component {
  state = {
    homeLocation: null,
    maxDistance: 20000,
    highlighted: null,
    mobileShow: false
  };

  render() {
    const { homeLocation, maxDistance, highlighted, mobileShow } = this.state;

    const schoolsWithDistance = schools.map(school => {
      return {
        ...school,
        distance: homeLocation
          ? getDistance(
              { latitude: homeLocation.lat, longitude: homeLocation.lng },
              { latitude: school.lat, longitude: school.lng }
            )
          : null
      };
    });

    const distanceFilteredSchools = schoolsWithDistance.filter(school => {
      if (!school.distance) return true;
      return school.distance <= maxDistance;
    });

    const sortedSchools = distanceFilteredSchools.sort((a, b) => {
      if (a.name.toLowerCase() === b.name.toLowerCase()) {
        return 0;
      }
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      return 1;
    });

    return (
      <Container>
        <MobileNav>
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              this.setState({ mobileShow: false });
            }}
            style={{ fontWeight: mobileShow ? "normal" : "bold" }}
          >
            Kaart
          </a>{" "}
          |{" "}
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              this.setState({ mobileShow: true });
            }}
            style={{ fontWeight: mobileShow ? "bold" : "normal" }}
          >
            Tabel & filter
          </a>
        </MobileNav>
        <Map
          schools={sortedSchools}
          setHomeLocation={location =>
            this.setState({ homeLocation: location })
          }
          homeLocation={homeLocation}
          highlighted={highlighted}
        />
        <Right force={mobileShow}>
          <Help>
            <Alert
              type="info"
              message="Plaatsen in de instapklas voor schooljaar 2019-2020."
              description={
                <div>
                  <p>
                    Rechterklik (of duw lang op mobiel) op de kaart om je
                    thuisadres in te stellen en afstanden te kunnen berekenen.{" "}
                    <strong>Werkt best op desktop.</strong>
                  </p>
                  <p>
                    Een klein projectje van{" "}
                    <a href="https://broddin.be" target="_blank">
                      Tim Broddin
                    </a>
                    . Gebaseerd op de lijsten gepubliceerd door de stad
                    Antwerpen op 28/02/2019.
                  </p>
                </div>
              }
            />
          </Help>
          {homeLocation ? (
            <Filter
              schools={schools}
              maxDistance={maxDistance}
              changeMaxDistance={d => this.setState({ maxDistance: d })}
            />
          ) : null}

          <List
            schools={sortedSchools}
            setHighlighted={h => this.setState({ highlighted: h })}
          />
        </Right>
      </Container>
    );
  }
}

export default App;
