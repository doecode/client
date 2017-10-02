import React from 'react';
import Dropzone from 'react-dropzone';
import {Button} from 'react-bootstrap';
import MetadataField from '../field/MetadataField';
import {observer, Provider} from "mobx-react";
import Metadata from '../stores/Metadata';
import CountriesList from '../staticJson/countriesList';
import HelpTooltip from '../help/HelpTooltip';

const metadata = new Metadata();

@observer
export default class SupplementalInfoStep extends React.Component {

  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  onDrop(files) {
    metadata.setValue("files", files);
    metadata.setValue("file_name", files[0].name);
    metadata.validateField("file_name");
  }

  deleteFile() {
    metadata.setValue("files", []);
    metadata.setValue("file_name", "");
    metadata.validateField("file_name");
  }

  render() {

    const files = metadata.getValue("files");
    const filesInfo = metadata.getFieldInfo("file_name");

    const fileName = metadata.getValue("file_name");
    const accessibility = metadata.getValue("accessibility");

    const acceptedFileTypes = ".zip,.tar,.tar.gz,.tar.bz2";
    const acceptedFileTypesText = acceptedFileTypes.replace(/,/g, ", ").replace(/^((?:.+?, )*)(.*?)$/g, function(match, $1, $2) { return ($1 ? $1 + "and " : $1) + $2; });

    let fileLabelText = "Upload Source Code ";

    if (this.props.page == 'submit')
      fileLabelText += "(Required Field)";
    else
      fileLabelText += "(Optional Field)";

    const fileLabelStyle = {
      "paddingLeft": "0px"
    };

    return (

      <div className="container-fluid form-horizontal">
        <div className="row">
          <div className="col-md-8 col-xs-12">
            <MetadataField field="acronym" label="Short Title or Acronym" elementType="input" helpTooltip='ShortTitle'/>
            <MetadataField field="country_of_origin" label="Country of Origin" options={CountriesList.countries} elementType="select" helpTooltip='CountryOfOrigin'/>
            <MetadataField field="keywords" label="Keywords" elementType="input" helpTooltip='Keywords'/>
            <MetadataField field="other_special_requirements" label="Other Special Requirements" elementType="input" helpTooltip='OtherSpecialRequirements'/>
            <MetadataField field="site_accession_number" label="Site Accession Number" helpTooltip='SiteAccessionNumber' elementType="input"/> {(accessibility === 'ON' || accessibility === 'CS') && <div className="form-group form-group-sm row">
              <div>
                <label htmlFor="file_upload" className={filesInfo.error
                  ? "has-error error-color field-error form-label"
                  : "form-label"}>
                  {fileLabelText}&nbsp;<HelpTooltip item='FileUpload'/>
                </label>
                <br/>
                <small>Please upload an archive file containing your source code. This will be used for archiving purposes.</small>
                <br/>
                <small>Supported file types include: {acceptedFileTypesText}</small>
                <div>
                  <Dropzone name="file_upload" accept={acceptedFileTypes} onDrop={this.onDrop}>
                    <h2>
                      Drag files here or click to browse.
                    </h2>
                  </Dropzone>
                </div>

                {filesInfo.error && <span className="error-color">
                  <strong>{filesInfo.error}
                  </strong>
                </span>}
              </div>
            </div>}

            {filesInfo.completed && <div className="form-group form-group-sm row">
              <label className="col-sm-4" style={fileLabelStyle}>
                Uploaded File
              </label>
              <div className="col-sm-6">
                {fileName}
              </div>
              <div className="col-sm-2">
                <button type='button' className='pure-button button-error' onClick={this.deleteFile}>Delete File</button>
              </div>

            </div>}
          </div>
        </div>
      </div>
    );
  }

}
