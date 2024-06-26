import React from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import ConfirmationDialog from './ConfirmationDialog';
import Fields from '../fields';
import FormHeading from './FormHeading';
import AltText from './AltText';
import FooterBar from './FooterBar';
import InvalidFieldType from './InvalidFieldType';
import { Button, Col, Form, FormField, FormInput, ResponsiveText, Row } from 'elemental';

function upCase(str) {
  return str.slice(0, 1).toUpperCase() + str.substr(1).toLowerCase();
};

var EditForm = React.createClass({
  displayName: 'EditForm',
  propTypes: {
    data: React.PropTypes.object,
    list: React.PropTypes.object,
  },
  getInitialState() {
    return {
      values: Object.assign({}, this.props.data.fields),
      confirmationDialog: null,
    };
  },
  getFieldProps(field) {
    var props = Object.assign({}, field);
    props.value = this.state.values[field.path];
    props.values = this.state.values;
    props.onChange = this.handleChange;
    props.mode = 'edit';
    return props;
  },
  handleChange(event) {
    let values = Object.assign({}, this.state.values);

    values[event.path] = event.value;
    this.setState({ values });
  },
  confirmReset(event) {
    const confirmationDialog = (
      <ConfirmationDialog
        isOpen
        body={`Reset your changes to <strong>${this.props.data.name}</strong>?`}
        confirmationLabel="Reset"
        onCancel={this.removeConfirmationDialog}
        onConfirmation={this.handleReset}
      />
    );
    event.preventDefault();
    this.setState({ confirmationDialog });
  },
  handleReset() {
    window.location.reload();
  },
  confirmDelete() {
    const confirmationDialog = (
      <ConfirmationDialog
        isOpen
        body={`Are you sure you want to delete <strong>${this.props.data.name}?</strong><br /><br />This cannot be undone.`}
        confirmationLabel="Delete"
        onCancel={this.removeConfirmationDialog}
        onConfirmation={this.handleDelete}
      />
    );
    this.setState({ confirmationDialog });
  },
  handleDelete() {
    let { data, list } = this.props;
    list.deleteItem(data.id, err => {
      if (err) {
        console.error(`Problem deleting ${list.singular}: ${data.name}`);
        // TODO: slow a flash message on form
        return;
      }
      top.location.href = `${Keystone.adminPath}/${list.path}`;
    });
  },
  handleKeyFocus() {
    const input = findDOMNode(this.refs.keyOrIdInput);
    input.select();
  },
  removeConfirmationDialog() {
    this.setState({
      confirmationDialog: null,
    });
  },
  renderKeyOrId() {
    var className = 'EditForm__key-or-id';
    var list = this.props.list;

    if (list.nameField && list.autokey && this.props.data[list.autokey.path]) {
      return (
        <div className={className}>
          <AltText
            normal={`${upCase(list.autokey.path)}: `}
            modified="ID:"
            component="span"
            title="Press <alt> to reveal the ID"
            className="EditForm__key-or-id__label" />
          <AltText
            normal={<input ref="keyOrIdInput" onFocus={this.handleKeyFocus} value={this.props.data[list.autokey.path]} className="EditForm__key-or-id__input" readOnly />}
            modified={<input ref="keyOrIdInput" onFocus={this.handleKeyFocus} value={this.props.data.id} className="EditForm__key-or-id__input" readOnly />}
            component="span"
            title="Press <alt> to reveal the ID"
            className="EditForm__key-or-id__field" />
        </div>
      );
    } else if (list.autokey && this.props.data[list.autokey.path]) {
      return (
        <div className={className}>
          <span className="EditForm__key-or-id__label">{list.autokey.path}: </span>
          <div className="EditForm__key-or-id__field">
            <input ref="keyOrIdInput" onFocus={this.handleKeyFocus} value={this.props.data[list.autokey.path]} className="EditForm__key-or-id__input" readOnly />
          </div>
        </div>
      );
    } else if (list.nameField) {
      return (
        <div className={className}>
          <span className="EditForm__key-or-id__label">ID: </span>
          <div className="EditForm__key-or-id__field">
            <input ref="keyOrIdInput" onFocus={this.handleKeyFocus} value={this.props.data.id} className="EditForm__key-or-id__input" readOnly />
          </div>
        </div>
      );
    }
  },
  renderNameField() {
    var nameField = this.props.list.nameField;
    var nameIsEditable = this.props.list.nameIsEditable;
    var wrapNameField = field => (
      <div className="EditForm__name-field">
        {field}
      </div>
    );
    if (nameIsEditable) {
      var nameFieldProps = this.getFieldProps(nameField);
      nameFieldProps.label = null;
      nameFieldProps.size = 'full';
      nameFieldProps.inputProps = {
        className: 'item-name-field',
        placeholder: nameField.label,
        size: 'lg',
      };
      return wrapNameField(
        React.createElement(Fields[nameField.type], nameFieldProps)
      );
    } else {
      return wrapNameField(
        <h2>{this.props.data.name || '(no name)'}</h2>
      );
    }
  },
  renderFormElements() {
    var headings = 0;

    return this.props.list.uiElements.map((el) => {
      if (el.type === 'heading') {
        headings++;
        el.options.values = this.state.values;
        el.key = 'h-' + headings;
        return React.createElement(FormHeading, el);
      }

      if (el.type === 'field') {
        var field = this.props.list.fields[el.field];
        var props = this.getFieldProps(field);
        if (typeof Fields[field.type] !== 'function') {
          return React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path });
        }
        if (props.dependsOn) {
          props.currentDependencies = {};
          Object.keys(props.dependsOn).forEach(dep => {
            props.currentDependencies[dep] = this.state.values[dep];
          });
        }
        props.key = field.path;
        if (props.key === 'relateds') {
          return React.createElement(Fields.sortablerelateds, props);
        } else if (props.key === 'categories') {
          // Remove Fields.relationshipForCategory when migration is done.
          return React.createElement(Fields.relationshipForCategory, props);
        } else if (props.key === 'tags') {
          // Remove Fields.relationshipForTag when migration is done.
          return React.createElement(Fields.relationshipForTag, props);
        } else if (props.key === 'categorySet') {
          return React.createElement(Fields.categorySet, props);
        } else {
          return React.createElement(Fields[field.type], props);
        }
      }
    }, this);
  },
  renderFooterBar() {
    var buttons = [
      <Button key="save" type="primary" submit>Save</Button>,
    ];
    buttons.push(
      <Button key="reset" onClick={this.confirmReset} type="link-cancel">
        <ResponsiveText hiddenXS="reset changes" visibleXS="reset" />
      </Button>
    );
    if (!this.props.list.nodelete) {
      buttons.push(
        <Button key="del" onClick={this.confirmDelete} type="link-delete" className="u-float-right">
          <ResponsiveText hiddenXS={`delete ${this.props.list.singular.toLowerCase()}`} visibleXS="delete" />
        </Button>
      );
    }
    return (
      <FooterBar className="EditForm__footer">
        {buttons}
      </FooterBar>
    );
  },
  renderTrackingMeta() {
    if (!this.props.list.tracking) return null;

    var elements = [];
    var data = {};

    if (this.props.list.tracking.createdAt) {
      data.createdAt = this.props.data.fields[this.props.list.tracking.createdAt];
      if (data.createdAt) {
        elements.push(
          <FormField key="createdAt" label="Created on">
            <FormInput noedit title={moment(data.createdAt).format('DD/MM/YYYY h:mm:ssa')}>{moment(data.createdAt).format('Do MMM YYYY')}</FormInput>
          </FormField>
        );
      }
    }

    if (this.props.list.tracking.createdBy) {
      data.createdBy = this.props.data.fields[this.props.list.tracking.createdBy];
      if (data.createdBy) {
        // todo: harden logic around user name
        elements.push(
          <FormField key="createdBy" label="Created by">
            <FormInput noedit>{data.createdBy.name.first} {data.createdBy.name.last}</FormInput>
          </FormField>
        );
      }
    }

    if (this.props.list.tracking.updatedAt) {
      data.updatedAt = this.props.data.fields[this.props.list.tracking.updatedAt];
      if (data.updatedAt && (!data.createdAt || data.createdAt !== data.updatedAt)) {
        elements.push(
          <FormField key="updatedAt" label="Updated on">
            <FormInput noedit title={moment(data.updatedAt).format('DD/MM/YYYY h:mm:ssa')}>{moment(data.updatedAt).format('Do MMM YYYY')}</FormInput>
          </FormField>
        );
      }
    }

    if (this.props.list.tracking.updatedBy) {
      data.updatedBy = this.props.data.fields[this.props.list.tracking.updatedBy];
      if (data.updatedBy && (!data.createdBy || data.createdBy.id !== data.updatedBy.id || elements.updatedAt)) {
        elements.push(
          <FormField key="updatedBy" label="Updated by">
            <FormInput noedit>{data.updatedBy.name.first} {data.updatedBy.name.last}</FormInput>
          </FormField>
        );
      }
    }

    return Object.keys(elements).length ? (
      <div className="EditForm__meta">
        <h3 className="form-heading">Meta</h3>
        {elements}
      </div>
    ) : null;
  },
  render() {
    return (
      <form method="post" encType="multipart/form-data" className="EditForm-container">
        <Row>
          <Col lg="3/4">
            <Form type="horizontal" className="EditForm" component="div">
              <input type="hidden" name="action" value="updateItem" />
              <input type="hidden" name={Keystone.csrf.key} value={Keystone.csrf.value} />
              {this.renderNameField()}
              {this.renderKeyOrId()}
              {this.renderFormElements()}
              {this.renderTrackingMeta()}
            </Form>
          </Col>
          <Col lg="1/4"><span /></Col>
        </Row>
        {this.renderFooterBar()}
        {this.state.confirmationDialog}
      </form>
    );
  },
});

module.exports = EditForm;
