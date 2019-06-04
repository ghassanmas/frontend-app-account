import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-i18n';
import { Button, Hyperlink } from '@edx/paragon';

// Actions
import {
  deleteAccount,
  deleteAccountConfirmation,
  deleteAccountFailure,
  deleteAccountReset,
  deleteAccountCancel,
} from './data/actions';

// Messages
import messages from './messages';

// Components
import ConfirmationModal from './ConfirmationModal';
import PrintingInstructions from './PrintingInstructions';
import SuccessModal from './SuccessModal';
import BeforeProceedingBanner from './BeforeProceedingBanner';

class DeleteAccount extends React.Component {
  state = {
    password: '',
  };

  handleSubmit = () => {
    if (this.state.password === '') {
      this.props.deleteAccountFailure('empty-password');
    } else {
      this.props.deleteAccount(this.state.password);
    }
  };

  handleCancel = () => {
    this.setState({ password: '' });
    this.props.deleteAccountCancel();
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value.trim() });
    this.props.deleteAccountReset();
  };

  handleFinalClose = () => {
    global.location = this.props.logoutUrl;
  };

  render() {
    const {
      hasLinkedTPA, isVerifiedAccount, status, errorType, intl,
    } = this.props;
    const canDelete = isVerifiedAccount && !hasLinkedTPA;

    return (
      <div>
        <h2 className="section-heading">
          {intl.formatMessage(messages['account.settings.delete.account.header'])}
        </h2>
        <p>{intl.formatMessage(messages['account.settings.delete.account.subheader'])}</p>
        <p>{intl.formatMessage(messages['account.settings.delete.account.text.1'])}</p>
        <p>{intl.formatMessage(messages['account.settings.delete.account.text.2'])}</p>
        <p>
          <PrintingInstructions />
        </p>
        <p className="text-danger h6">
          {intl.formatMessage(messages['account.settings.delete.account.text.warning'])}
        </p>
        <p>
          <Hyperlink destination="https://support.edx.org/hc/en-us/sections/115004139268-Manage-Your-Account-Settings">
            {intl.formatMessage(messages['account.settings.delete.account.text.change.instead'])}
          </Hyperlink>
        </p>
        <p>
          <Button
            className="btn-outline-danger"
            onClick={canDelete ? this.props.deleteAccountConfirmation : null}
            disabled={!canDelete}
          >
            {intl.formatMessage(messages['account.settings.delete.account.button'])}
          </Button>
        </p>

        {isVerifiedAccount ? null : (
          <BeforeProceedingBanner
            instructionMessageId="account.settings.delete.account.please.activate"
            supportUrl="https://support.edx.org/hc/en-us/articles/115000940568-How-do-I-activate-my-account-"
          />
        )}

        {hasLinkedTPA ? (
          <BeforeProceedingBanner
            instructionMessageId="account.settings.delete.account.please.unlink"
            supportUrl="https://support.edx.org/hc/en-us/articles/207206067"
          />
        ) : null}

        <ConfirmationModal
          status={status}
          errorType={errorType}
          onSubmit={this.handleSubmit}
          onCancel={this.handleCancel}
          onChange={this.handlePasswordChange}
          password={this.state.password}
        />

        <SuccessModal status={status} onClose={this.handleFinalClose} />
      </div>
    );
  }
}

DeleteAccount.propTypes = {
  deleteAccount: PropTypes.func.isRequired,
  deleteAccountConfirmation: PropTypes.func.isRequired,
  deleteAccountFailure: PropTypes.func.isRequired,
  deleteAccountReset: PropTypes.func.isRequired,
  deleteAccountCancel: PropTypes.func.isRequired,
  status: PropTypes.oneOf(['confirming', 'pending', 'deleted', 'failed']),
  errorType: PropTypes.oneOf(['empty-password', 'server']),
  hasLinkedTPA: PropTypes.bool,
  isVerifiedAccount: PropTypes.bool,
  logoutUrl: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

DeleteAccount.defaultProps = {
  hasLinkedTPA: false,
  isVerifiedAccount: true,
  status: null,
  errorType: null,
};

// Assume we're part of the accountSettings state.
const mapStateToProps = state => state.accountSettings.deleteAccount;

export default connect(
  mapStateToProps,
  {
    deleteAccount,
    deleteAccountConfirmation,
    deleteAccountFailure,
    deleteAccountReset,
    deleteAccountCancel,
  },
)(injectIntl(DeleteAccount));
