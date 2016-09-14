var Panel = require('views/panel');
var Alert = require('alert');

var AttributeEditor = React.createClass({
  /*
   * Get default state.
   * @return {object} state
   */
  getInitialState: function() {
    return {
      disabled: true,
      formValues: {}
    };
  },
  /**
   * Abort any operation and deselect any tool
   * when the components unmounts.
   * @override
   * @param {ol.event} event
   */
  componentWillUnmount: function () {
  },
  /**
   * @override
   */
  componentWillMount: function () {
  },
  /**
   * @override
   */
  componentDidMount: function () {
    this.props.model.on('change:editFeature', (attr) => {
      var valueMap = {}
      ,   feature = this.props.model.get('editFeature')
      ,   source = this.props.model.get('editSource')
      ,   props
      ,   defaultValue = "";

      if (!feature || !source) return;

      props = feature.getProperties();

      source.editableFields.map(field => {
        if (field.dataType === "number" || field.dataType === "int")
          defaultValue = 0;

        if (field.dataType === "date")
          defaultValue = new Date().toLocaleString();

        valueMap[field.name] = props[field.name] || defaultValue;
      });

      this.state.formValues = valueMap;
    });
  },

  updateFeature: function () {
    var props = this.props.model.get('editFeature').getProperties();

    Object.keys(this.state.formValues).forEach(key => {
      props[key] = this.state.formValues[key];
    });
    this.props.model.get('editFeature').setProperties(props);

    console.log("Set props", props);

  },

  checkInteger: function (name, value) {
    if (/^\d+$/.test(value) || value === "") {
      this.state.formValues[name] = value;
      this.updateFeature();
      this.setState({
        formValues: this.state.formValues
      });
    }
  },

  checkNumber: function (name, value) {
    if (/^\d+([\.\,](\d+)?)?$/.test(value) || value === "") {
      value = value.replace(',', '.');
      this.state.formValues[name] = value;
      this.updateFeature();
      this.setState({
        formValues: this.state.formValues
      });
    }
  },

  checkText: function (name, value) {
    this.state.formValues[name] = value;
    this.updateFeature();
    this.setState({
      formValues: this.state.formValues
    });
  },

  checkSelect: function (name, value) {
    this.state.formValues[name] = value;
    this.updateFeature();
    this.setState({
      formValues: this.state.formValues
    });
  },

  checkDate: function (name, date) {
    var value = date.format('Y-MM-DD HH:mm:ss');
    this.state.formValues[name] = value;
    this.updateFeature();
    this.setState({
      formValues: this.state.formValues
    });
  },

  setChanged: function() {
    this.props.model.get('editFeature').modification = 'updated';
  },

  getValueMarkup: function (field) {

    if (field.dataType === "int") {
      field.textType = "heltal";
    }

    if (field.dataType === "number") {
      field.textType = "nummer";
    }

    if (field.dataType === "date") {
      field.textType = "datum";
    }

    var value = this.state.formValues[field.name];
    switch (field.textType) {
      case "heltal":
        return (
          <input className="form-control" type="text" value={value} onChange={(e) => {
            this.setChanged();
            this.checkInteger(field.name, e.target.value)}}
          />
        );
      case "nummer":
        return (
          <input className="form-control" type="text" value={value} onChange={(e) => {
              this.setChanged();
              this.checkNumber(field.name, e.target.value)
            }}
          />
        );
      case "datum":
        value = value.replace('T', ' ').replace('Z','')
        return (
          <Datetime dateFormat="Y-MM-DD" timeFormat="HH:mm:ss" value={value} onChange={(date) => {
              this.setChanged(); this.
              checkDate(field.name, date);
            }}
          />
        );
      case "fritext":
        return (
          <input className="form-control" type="text" value={value} onChange={(e) => {
              this.setChanged();
              this.checkText(field.name, e.target.value)
            }}
          />
        );
      case "lista":
        let options = field.values.map((val, i) => <option key={i} value={val}>{val}</option>);
        return (
          <select className="form-control" value={value} onChange={(e) => {
              this.setChanged();
              this.checkSelect(field.name, e.target.value)
            }}
          >
          {options}
          </select>
        )
      case null:
        return (<span>{value}</span>);
    }
  },
  /**
   * Render the component.
   * @return {React.Component} component
   */
  render: function () {

    if (!this.props.feature) return null;

    var markup = this.props.source.editableFields.map((field, i) => {
      return (
        <div key={i} className="field">
          <div>{field.name}</div>
          <div>{this.getValueMarkup(field)}</div>
        </div>
      )
    });

    return (
      <div>{markup}</div>
    );

  }
});

var Toolbar = React.createClass({
  /*
   * Get default state.
   * @return {object} state
   */
  getInitialState: function() {
    return {
      activeTool: undefined
    };
  },
  /**
   * Abort any operation and deselect any tool
   * when the components unmounts.
   * @override
   * @param {ol.event} event
   */
  componentWillUnmount: function () {
  },
  /**
   * @override
   */
  componentWillMount: function () {
  },
  /**
   * @override
   */
  componentDidMount: function () {
  },

  changeTool: function(type) {

    if (this.state.activeTool === type.toLowerCase()) {
      this.props.model.deactivateDrawTool(true);
      if (type === 'move') {
        this.props.model.get('layer').dragLocked = true;
      }

      return this.setState({
        activeTool: undefined
      });
    }

    switch (type) {
      case "Point":
      case "LineString":
      case "Polygon":
        return this.props.model.activateDrawTool(type);
      case "remove":
        return this.props.model.deactivateDrawTool(type);
      case "move":
        return this.props.model.deactivateDrawTool(type);
    }
  },

  onAddPointClicked: function() {
    this.props.model.get('layer').dragLocked = true;
    this.setState({activeTool: "point"});
    this.changeTool('Point');
  },

  onAddLineClicked: function() {
    this.props.model.get('layer').dragLocked = true;
    this.setState({activeTool: "linestring"});
    this.changeTool('LineString');
  },

  onAddPolygonClicked: function() {
    this.props.model.get('layer').dragLocked = true;
    this.setState({activeTool: "polygon"});
    this.changeTool('Polygon');
  },

  onRemoveClicked: function() {
    this.props.model.get('layer').dragLocked = true;
    this.props.model.setRemovalToolMode(this.state.activeTool === "remove" ? "off" : "on");
    this.setState({activeTool: "remove"});
    this.changeTool('remove');
  },

  onMoveClicked: function() {
    this.props.model.get('layer').dragLocked = false;
    this.setState({activeTool: "move"});
    this.changeTool('move');
  },

  onSaveClicked: function () {

    var getMessage = (data) => {
      if (!data)
        return `Uppdatateringen lyckades men det upptäcktes inte några ändringar.`;
      if (data.ExceptionReport) {
        return `Uppdateringen misslyckades: ${data.ExceptionReport.Exception.ExceptionText.toString()}`;
      }
      if (data.TransactionResponse && data.TransactionResponse.TransactionSummary) {
        return `Uppdateringen lyckades:
          antal skapade objekt: ${data.TransactionResponse.TransactionSummary.totalInserted}
          antal borttagna objekt: ${data.TransactionResponse.TransactionSummary.totalDeleted}
          antal uppdaterade objekt: ${data.TransactionResponse.TransactionSummary.totalUpdated}
        `
      } else {
        return 'Status för uppdateringen kunde inte avläsas ur svaret från servern.'
      }
    };

    if (!this.props.model.get('editSource'))
      return;

    this.props.panel.setState({
      loading: true
    });
    this.props.model.save((data) => {
      this.props.panel.setState({
        alert: true,
        loading: false,
        alertMessage: getMessage(data),
        confirm: false
      });
    });
  },

  onCancelClicked: function() {
    this.props.model.get('layer').dragLocked = true;
    this.props.model.deactivate();
    this.props.panel.setState({
      checked: false,
      enabled: false
    });
    this.setState({
      activeTool: undefined
    });
  },

  render: function () {

    var disabled = !this.props.enabled;
    var isActive = (type) => {
      return this.state.activeTool === type ? "btn btn-primary" : "btn btn-default";
    };

    return (
      <div>
        <div className="edit-toolbar-wrapper">
          <div className="btn-group btn-group-lg map-toolbar">
            <button
              disabled={disabled}
              onClick={() => {this.onAddPointClicked()}}
              className={isActive("point")}
              type="button"
              title="Lägg till punkt"
            >
              <i className="iconmoon-punkt"></i>
            </button>
            <button
              disabled={disabled}
              onClick={() => {this.onAddLineClicked()}}
              className={isActive("linestring")}
              type="button"
              title="Lägg till linje"
            >
              <i className="iconmoon-linje"></i>
            </button>
            <button
              disabled={disabled}
              onClick={() => {this.onAddPolygonClicked()}}
              className={isActive("polygon")}
              type="button"
              title="Lägg till yta"
            >
              <i className="iconmoon-yta"></i>
            </button>
            <button
              disabled={disabled}
              onClick={() => {this.onMoveClicked()}}
              className={isActive("move")}
              type="button"
              title="Flytta geometri"
            >
              <i className="fa fa-arrows icon"></i>
            </button>
            <button
              disabled={disabled}
              onClick={() => {this.onRemoveClicked()}}
              className={isActive("remove")}
              type="button"
              title="Ta bort geometri"
            >
              <i className="fa fa-eraser icon"></i>
            </button>
            <button
              disabled={disabled}
              onClick={(e) => {this.onSaveClicked()}}
              className="btn btn-default"
              type="button"
              title="Spara"
            >
              <i className="fa fa-floppy-o icon"></i>
            </button>
            <button
              disabled={disabled}
              onClick={(e) => {this.onCancelClicked()}}
              className="btn btn-default"
              type="button"
              title="Avbryt"
            >
              <i className="fa fa-ban icon"></i>
            </button>
          </div>
        </div>
      </div>
    )
  }
});

var EditPanel = React.createClass({
  /*
   * Get default state.
   * @return {object} state
   */
  getInitialState: function() {
    return {
      visible: false,
      enabled: false,
      checked: false
    };
  },
  /**
   * Abort any operation and deselect any tool
   * when the components unmounts.
   * @override
   * @param {ol.event} event
   */
  componentWillUnmount: function () {
    this.props.model.off('change:editFeature');
  },
  /**
   * @override
   */
  componentWillMount: function () {
  },
  /**
   * @override
   */
  componentDidMount: function () {

    this.props.model.on('change:editFeature', (attr) => {
      this.setState({
        editFeature: this.props.model.get('editFeature'),
        editSource: this.props.model.get('editSource')
      });
    });

    this.props.model.on('change:removeFeature', (attr) => {
      if (this.props.model.get('removeFeature')) {
        this.setState({
          alert: true,
          alertMessage: ` Vill du ta bort markerat obekt?

            Tryck därefter på sparaknappen för definitiv verkan.
          `,
          confirm: true,
          confirmAction: () => {
            var feature = this.props.model.get('removeFeature')
            this.props.model.get('select').getFeatures().remove(feature);
            feature.modification = 'removed';
            feature.setStyle(this.props.model.getHiddenStyle());
          },
          denyAction: () => {
            this.setState({ alert: false });
            this.props.model.set('removeFeature', undefined)
          }
        });
      }
    });

  },

  setLayer: function (source) {

    var clear = () => {
      var time = new Date().getTime() - timer;
      if (time < 1000) {
        setTimeout(() => {
          this.setState({ loading: false });
        }, 1000 - time);
      } else {
        this.setState({ loading: false });
      }
    };

    var timer = new Date().getTime();

    var changeActiveLayer = () => {
      this.setState({
        checked: source.caption,
        loading: true,
        enabled: true
      });
      this.props.model.setLayer(source, clear);
    }

    if (this.props.model.filty) {
      this.setState({
        alert: true,
        alertMessage: `Du har en aktiv redigeringssession startad dina ändringar kommer att gå förlorade.

        Vill du forstätta ändå?`,
        confirm: true,
        confirmAction: () => {
          changeActiveLayer();
        },
        denyAction: () => {
          this.setState({ alert: false });
        }
      });
    } else {
      changeActiveLayer();
    }

  },
  /**
   * Render the component.
   * @return {React.Component} component
   */
  renderAlert: function () {
    var options = {
      visible: this.state.alert,
      message: this.state.alertMessage,
      confirm: this.state.confirm,
      confirmAction: () => {
        this.state.confirmAction();
        this.setState({
          alert: false,
          confirm: false,
          alertMessage: ""
        })
      },
      denyAction: () => {
        this.state.denyAction();
        this.setState({
          alert: false,
          confirm: false,
          alertMessage: ""
        })
      },
      onClick: () => {
        this.setState({
          alert: false,
          alertMessage: ""
        })
      }
    };

    if (this.state.alert) {
      return <Alert options={options}/>
    } else {
      return null;
    }
  },
  /**
   * Render the panel component.
   * @return {React.Component} component
   */
  render: function () {

    var visible = true, options, loader;

    options = () => {
      return this.props.model.get('sources').map(
        (source, i) => {
          var id = "edit-layer-" + i;
          return (
            <div key={i} className="list-item">
              <input id={id} type="radio" name="source" checked={this.state.checked === source.caption} onChange={(e) => {
                this.setLayer(source)
              }} />
              <label htmlFor={id}>{source.caption}</label>
            </div>
          )
        }
      )
    };

    if (this.state.loading) {
      loader = <div className="layer-loader"></div>;
    }

    return (
      <Panel title="Editera lager" onCloseClicked={this.props.onCloseClicked} minimized={this.props.minimized}>
        <div className="edit-tools">
          <div className="loading-bar">
            {loader}
          </div>
          <Toolbar enabled={this.state.enabled} loading={this.state.loading} model={this.props.model} panel={this} />
          <ul className="edit-layers">
            {options()}
          </ul>
          <AttributeEditor feature={this.state.editFeature} source={this.state.editSource} model={this.props.model} activeTool={this.state.activeTool}/>
        </div>
        {this.renderAlert()}
      </Panel>
    );
  }
});

module.exports = EditPanel;