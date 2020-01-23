/*
Copyright 2020 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import * as sdk from '../../../../index';
import PropTypes from 'prop-types';
import { _t } from '../../../../languageHandler';

import SettingsStore, {SettingLevel} from "../../../../settings/SettingsStore";
import LabelledToggleSwitch from "../../../../components/views/elements/LabelledToggleSwitch";
import Field from "../../../../components/views/elements/Field";
import {formatBytes} from "../../../../utils/FormattingUtils";
import EventIndexPeg from "../../../../indexing/EventIndexPeg";
import AccessibleButton from "../../../../components/views/elements/AccessibleButton";


/*
 * Walks the user through the process of creating an e2e key backup
 * on the server.
 */
export default class ManageEventIndex extends React.Component {
    static propTypes = {
        onFinished: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            eventIndexingEnabled:
                SettingsStore.getValueAt(SettingLevel.DEVICE, 'enableEventIndexing'),
        };
    }

    _onDisable = async () => {
        const eventIndex = EventIndexPeg.get();
        await SettingsStore.setValue('enableEventIndexing', null, SettingLevel.DEVICE, false);
        await EventIndexPeg.deleteEventIndex();
        this.props.onFinished(true);
    }

    render() {
        const BaseDialog = sdk.getComponent('views.dialogs.BaseDialog');
        const DialogButtons = sdk.getComponent("views.elements.DialogButtons");

        return (
            <BaseDialog className='mx_ManageEventIndexDialog'
                onFinished={this.props.onFinished}
                title={_t("Are you sure?")}
            >
            {_t("If disabled, messages form encrypted rooms won't appear in search results")}
            <DialogButtons
                primaryButton={_t("Disable")}
                onPrimaryButtonClick={this._onDisable}
                cancelButton={_t("Cancel")}
                onCancel={this.props.onFinished}
            />
            </BaseDialog>
        );
    }
}
