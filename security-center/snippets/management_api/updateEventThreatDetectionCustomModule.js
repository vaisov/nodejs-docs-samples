/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/**
 *  Updates an existing event threat detection custom module.
 */
function main(organizationId, customModuleId, location = 'global') {
  // [START securitycenter_update_event_threat_detection_custom_module]
  // Imports the Google Cloud client library.
  const {SecurityCenterManagementClient} =
    require('@google-cloud/securitycentermanagement').v1;

  // Create a Security Center Management client
  const client = new SecurityCenterManagementClient();

  /*
   * Required. Resource name of event threat detection module.
   *     Its format is
   *    `organizations/[organization_id]/locations/[location_id]/eventThreatDetectionCustomModules/[custom_module]`
   *    `folders/[folder_id]/locations/[location_id]/eventThreatDetectionCustomModules/[custom_module]`
   *    `projects/[project_id]/locations/[location_id]/eventThreatDetectionCustomModules/[custom_module]`
   */
  // TODO(developer): Update the following references for your own environment before running the sample.
  // const organizationId = 'YOUR_ORGANIZATION_ID';
  // const location = 'LOCATION_ID';
  // const customModuleId = 'CUSTOM_MODULE_ID';
  const name = `organizations/${organizationId}/locations/${location}/eventThreatDetectionCustomModules/${customModuleId}`;

  // Define the event threat detection custom module configuration, update the
  // EnablementState accordingly.
  const eventThreatDetectionCustomModule = {
    name: name,
    enablementState: 'DISABLED',
  };

  // Set the field mask to specify which properties should be updated.
  const fieldMask = {
    paths: ['enablement_state'],
  };

  // Build the request.
  const updateEventThreatDetectionCustomModuleRequest = {
    eventThreatDetectionCustomModule: eventThreatDetectionCustomModule,
    updateMask: fieldMask,
  };

  async function updateEventThreatDetectionCustomModule() {
    // Call the API.
    const [response] = await client.updateEventThreatDetectionCustomModule(
      updateEventThreatDetectionCustomModuleRequest
    );
    console.log('Updated EventThreatDetectionCustomModule: %j', response);
  }

  updateEventThreatDetectionCustomModule();
  // [END securitycenter_update_event_threat_detection_custom_module]
}

main(...process.argv.slice(2));
