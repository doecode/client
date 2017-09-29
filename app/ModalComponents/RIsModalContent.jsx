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
        value: 'DOI',
        title: 'DOI'
      }, {
        label: 'URL',
        value: 'URL',
        title: 'URL'
      }
    ];

    const relationTypes = [
      {
        label: 'Cites',
        value: 'Cites',
        title: 'Cites'
      }, {
        label: 'IsCitedBy',
        value: 'IsCitedBy',
        title: 'IsCitedBy'
      }, {
        label: 'IsSupplementTo',
        value: 'IsSupplementTo',
        title: 'IsSupplementTo'
      }, {
        label: 'IsSupplementedBy',
        value: 'IsSupplementedBy',
        title: 'IsSupplementedBy'
      }, {
        label: 'IsContinuedBy',
        value: 'IsContinuedBy',
        title: 'IsContinuedBy'
      }, {
        label: 'Continues',
        value: 'Continues',
        title: 'Continues'
      }, {
        label: 'HasMetadata',
        value: 'HasMetadata',
        title: 'HasMetadata'
      }, {
        label: 'IsMetadataFor',
        value: 'IsMetadataFor',
        title: 'IsMetadataFor'
      }, {
        label: 'IsNewVersionOf',
        value: 'IsNewVersionOf',
        title: 'IsNewVersionOf'
      }, {
        label: 'IsPreviousVersionOf',
        value: 'IsPreviousVersionOf',
        title: 'IsPreviousVersionOf'
      }, {
        label: 'IsPartOf',
        value: 'IsPartOf',
        title: 'IsPartOf'
      }, {
        label: 'HasPart',
        value: 'HasPart',
        title: 'HasPart'
      }, {
        label: 'IsReferencedBy',
        value: 'IsReferencedBy',
        title: 'IsReferencedBy'
      }, {
        label: 'References',
        value: 'References',
        title: 'References'
      }, {
        label: 'IsDocumentedBy',
        value: 'IsDocumentedBy',
        title: 'IsDocumentedBy'
      }, {
        label: 'Documents',
        value: 'Documents',
        title: 'Documents'
      }, {
        label: 'IsCompiledBy',
        value: 'IsCompiledBy',
        title: 'IsCompiledBy'
      }, {
        label: 'Compiles',
        value: 'Compiles',
        title: 'Compiles'
      }, {
        label: 'IsVariantFormOf',
        value: 'IsVariantFormOf',
        title: 'IsVariantFormOf'
      }, {
        label: 'IsOriginalFormOf',
        value: 'IsOriginalFormOf',
        title: 'IsOriginalFormOf'
      }, {
        label: 'IsIdenticalTo',
        value: 'IsIdenticalTo',
        title: 'IsIdenticalTo'
      }, {
        label: 'IsReviewedBy',
        value: 'IsReviewedBy',
        title: 'IsReviewedBy'
      }, {
        label: 'Reviews',
        value: 'Reviews',
        title: 'Reviews'
      }, {
        label: 'IsDerivedFrom',
        value: 'IsDerivedFrom',
        title: 'IsDerivedFrom'
      }, {
        label: 'IsSourceOf',
        value: 'IsSourceOf',
        title: 'IsSourceOf'
      }
    ];

    const SpecificField = this.props.SpecificField;

    return (
      <div className="container-fluid form-horizontal">
        <SpecificField field="identifier_type" helpTooltip='IdentifierType' label="Identifier Type" elementType="select" options={identifierTypes}/>
        <SpecificField field="relation_type" helpTooltip='RelationType' tooltipShort label="Relation Type" elementType="select" options={relationTypes}/>
        <SpecificField field="identifier_value" helpTooltip='Identifier' label="Identifier" elementType="input"/>
      </div>
    );
  }

}
