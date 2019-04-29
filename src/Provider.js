import * as React from "react";
import { connect } from "@digitaloptgroup/cms";
import { Context } from "./Context";

export class Provider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const cms = connect({
      projectId: this.props.projectId,
      apikey: this.props.apikey,
      apiUrl: this.props.apiUrl
    });

    this.setState({
      cms
    });
  }

  render() {
    return (
      <Context.Provider
        value={{
          cms: this.state.cms
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}
