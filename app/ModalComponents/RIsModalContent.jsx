import React from 'react';
import {observer} from "mobx-react";

@observer
export default class RIsModalContent extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const identifierTypes = [
      {
        label: 'DOI',
        value: 'DOI'
      }, {
        label: 'URL',
        value: 'URL'
      }
    ];

    const relationTypes = [
      {
        label: 'Cites',
        value: 'Cites'
      }, {
        label: 'IsCitedBy',
        value: 'IsCitedBy'
      }, {
        label: 'IsSupplementTo',
        value: 'IsSupplementTo'
      }, {
        label: 'IsSupplementedBy',
        value: 'IsSupplementedBy'
      }, {
        label: 'IsContinuedBy',
        value: 'IsContinuedBy'
      }, {
        label: 'Continues',
        value: 'Continues'
      }, {
        label: 'HasMetadata',
        value: 'HasMetadata'
      }, {
        label: 'IsMetadataFor',
        value: 'IsMetadataFor'
      }, {
        label: 'IsNewVersionOf',
        value: 'IsNewVersionOf'
      }, {
        label: 'IsPreviousVersionOf',
        value: 'IsPreviousVersionOf'
      }, {
        label: 'IsPartOf',
        value: 'IsPartOf'
      }, {
        label: 'HasPart',
        value: 'HasPart'
      }, {
        label: 'IsReferencedBy',
        value: 'IsReferencedBy'
      }, {
        label: 'References',
        value: 'References'
      }, {
        label: 'IsDocumentedBy',
        value: 'IsDocumentedBy'
      }, {
        label: 'Documents',
        value: 'Documents'
      }, {
        label: 'IsCompiledBy',
        value: 'IsCompiledBy'
      }, {
        label: 'Compiles',
        value: 'Compiles'
      }, {
        label: 'IsVariantFormOf',
        value: 'IsVariantFormOf'
      }, {
        label: 'IsOriginalFormOf',
        value: 'IsOriginalFormOf'
      }, {
        label: 'IsIdenticalTo',
        value: 'IsIdenticalTo'
      }, {
        label: 'IsReviewedBy',
        value: 'IsReviewedBy'
      }, {
        label: 'Reviews',
        value: 'Reviews'
      }, {
        label: 'IsDerivedFrom',
        value: 'IsDerivedFrom'
      }, {
        label: 'IsSourceOf',
        value: 'IsSourceOf'
      }
    ];

    const SpecificField = this.props.SpecificField;

    return (

      <div className="container-fluid form-horizontal">
        <SpecificField field="identifier_type" helpTooltip='IdentifierType' label="Identifier Type" elementType="select" options={identifierTypes}/>
        <SpecificField field="relation_type" helpTooltip='RelationType' label="Relation Type" elementType="select" options={relationTypes}/>
        <SpecificField field="identifier_value" helpTooltip='Identifier' label="Identifier" elementType="input"/>
      </div>
    );
  }

}
