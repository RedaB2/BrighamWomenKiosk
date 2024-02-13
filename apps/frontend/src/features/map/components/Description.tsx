// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { Component } from "react";
import { useMap } from "react-leaflet";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import L, { LeafletMouseEvent, Map } from "leaflet";

class CustomButton extends React.Component {
  //@ts-expect-error smth
  helpDiv;

  createButtonControl() {
    const MapHelp = L.Control.extend({
      //@ts-expect-error smth
      onAdd: (map) => {
        //@ts-expect-error smth
        const helpDiv = L.DomUtil.create("button", this.props.className);
        this.helpDiv = helpDiv;
        //@ts-expect-error smth
        helpDiv.innerHTML = this.props.title;

        helpDiv.addEventListener("click", () => {
          map;
          //@ts-expect-error smth
          this.props.onClick();
        });

        //a bit clueless how to add a click event listener to this button and then
        // open a popup div on the map
        return helpDiv;
      },
    });
    //@ts-expect-error smth
    return new MapHelp({ position: this.props.position });
  }

  componentDidMount() {
    //@ts-expect-error smth
    const { map } = this.props;
    const control = this.createButtonControl();
    control.addTo(map);
  }

  componentWillUnmount() {
    this.helpDiv.remove();
  }

  render() {
    return null;
  }
}
//@ts-expect-error smth
function withMap(Component) {
  //@ts-expect-error smth
  return function WrappedComponent(props) {
    const map = useMap();
    return <Component {...props} map={map} />;
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export default withMap(CustomButton);
