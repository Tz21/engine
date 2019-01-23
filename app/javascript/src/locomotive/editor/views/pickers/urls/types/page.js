import React, { Component } from 'react';
import { isBlank } from '../../../../utils/misc';
import i18n from '../../../../i18n';

// Components
import Autosuggest from './shared/autosuggest';
import Select from './shared/select';
import NewWindowCheckbox from './shared/new_window_checkbox';

class Page extends Component {

  constructor(props) {
    super();
    this.state = { settings: {}, sections: [] };
  }

  componentDidMount() {
    const { settings, api } = this.props;

    this.setState({ settings }, () => {
      if (isBlank(settings.value)) return; // no selected page

      // required to re-populate the sections select box
      api.searchForResources('page', settings.value)
      .then(data => this.setState({ sections: (data?.list || [])[0]?.sections }));
    });
  }

  _handleChange(newSettings, extraData) {
    this.setState({
      ...extraData,
      settings: Object.assign(this.state.settings, newSettings)
    }, () => this.props.handleChange(this.state.settings));
  }

  handlePageChanged(newSettings) {
    const { sections, ...settings } = newSettings;
    this._handleChange(Object.assign(settings, { section_id: '' }), { sections });
  }

  handleSectionChanged(newSectionId) {
    this._handleChange({ section_id: newSectionId }, {});
  }

  handleNewWindowChanged(checked) {
    this._handleChange({ new_window: checked }, {});
  }

  renderPagePicker() {
    return (
      <Autosuggest
        label={i18n.t('views.pickers.url.page.label')}
        placeholder={i18n.t('views.pickers.url.page.placeholder')}
        input={(this.state.settings?.label || [])[1] || ''}
        search={input => this.props.api.searchForResources('page', input) }
        handleChange={value => this.handlePageChanged(value)}
        handleNewInput={() => this.setState({ settings: {} })}
      />
    );
  }

  renderSectionPicker() {
    return (
      <Select
        label={i18n.t('views.pickers.url.page.section_label')}
        value={this.state.settings.section_id}
        list={this.props.buildSectionOptions(this.state.sections)}
        includeEmpty={true}
        onChange={id => this.handleSectionChanged(id)}
      />
    )
  }

  renderNewWindowCheckbox() {
    return (
      <NewWindowCheckbox
        label={i18n.t('views.pickers.url.open_new_window')}
        checked={this.state.settings.new_window}
        onChange={checked => this.handleNewWindowChanged(checked)}
      />
    )
  }

  render() {
    const { settings, sections } = this.state;

    return (
      <div className="url-picker-page-settings">
        {this.renderPagePicker()}

        {settings && sections.length > 0 && this.renderSectionPicker()}

        {settings && this.renderNewWindowCheckbox()}
      </div>
    )
  }

}

export default Page;
