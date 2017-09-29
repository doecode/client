import React from 'react';
import ReactTooltip from 'react-tooltip';

export default class HelpTooltip extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let returnData = null;
    const shortTooltip = !(this.props.shortVersion === undefined || this.props.shortVersion === null || this.props.shortVersion === false);

    if (this.props.item == "Autopopulate") {
      returnData = (shortTooltip)
        ? (
          <span>If a valid repository URL is provided this function will attempt to automatically populate metadata fields based on information provided in the repository. DOE CODE also provides functionality to allow users to auto-populate metadata by placing a specifically formatted YAML file in their repository's root main directory. The file must be named "metadata.yml" or "doecode.yml" and the file must be formatted correctly.
          </span>
        )
        : (
          <span>
            If a valid repository URL is provided this function will attempt to automatically populate metadata fields based on information provided in the repository. DOE CODE also provides functionality to allow users to auto-populate metadata by placing a specifically formatted YAML file in their repository's root main directory. The file must be named "metadata.yml" or "doecode.yml" and the file must be formatted correctly. For detailed information and an example file please see:&nbsp;
            <a title='Metadata Schema' target='_blank' href='https://github.com/doecode/doecode/tree/master/metadata-schema'>https://github.com/doecode/doecode/tree/master/metadata-schema</a>.</span>
        );
    } else if (this.props.item == "ClosedSource") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Software that is not Open Source and for which access must be granted by contacting a licensing official. Software is often Closed Source because it is proprietary, sensitive, or has otherwise been deemed appropriate for limited distribution only. A landing page URL is required for submitting Closed Source code; the URL should provide additional information on how to obtain access to the code.</span>
        );
    } else if (this.props.item == "ContactInformation") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Provide the name, email address, phone number and organization of the submitter. This contact information will serve as the point of contact for DOE if there are questions about the submitted software. Contact information will not be shared in public output products.</span>
        );
    } else if (this.props.item == "Contributor") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>The name of a person or institution that has contributed to the software (code, documentation, tests, ideas, project guidance, etc.), but is not listed as a developer.</span>
        );
    } else if (this.props.item == "ContributorDOEOrg") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Check the box if the contributing organization is associated within the Department of Energy.</span>
        );
    } else if (this.props.item == "ContributorName") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>The name of the contributing organization. If the contributing organization is within the Department of Energy, please select from the list of DOE organizations. Other contributor organization names will be freeform.</span>
        );
    } else if (this.props.item == "ContributorOrg") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Other organizations which provided support to the project. May be entered in place of naming individual software developers.</span>
        );
    } else if (this.props.item == "ContributorType") {
      returnData = (shortTooltip)
        ? (
          <span>When adding a contributor, use contributor type to define the role of the contributor. A drop-down menu is provided.
          </span>
        )
        : (
          <span>When adding a contributor, use contributor type to define the role of the contributor. A drop-down menu is provided. For definitions of each contributor type, please see&nbsp;
            <a title='DataCite' href='https://schema.datacite.org/meta/kernel-4.0/'>DataCite</a>.</span>
        );
    } else if (this.props.item == "CountryOfOrigin") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Identify the country of origin for the software. Default is the United States.</span>
        );
    } else if (this.props.item == "DescriptionAbstract") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Provide a clear, concise, and publicly releasable description of the software, including the purpose, function, and capabilities. Text should be spell checked, limited to 2000 characters and follow input standards for special characters.&nbsp;
            <strong>DO NOT INCLUDE SENSITIVE INFORMATION IN THE DESCRIPTION/ABSTRACT.</strong>
          </span>
        );
    } else if (this.props.item == "Developers") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>A person concerned with facets of the software development process, including the research, design, programming, and testing of computer software. When there are multiple developers, the primary software developer should be listed first. “NONE” is an option when necessary.</span>
        );
    } else if (this.props.item == "DigitalObjectIdentifer") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>A unique persistent identifier that references a digital object and provides long-term access; DOIs remain stable even if the underlying address or URL for the content changes. If a DOI has not yet been minted for the software, OSTI will mint a persistent identifier, in the form of a DOI, for the software upon submission.</span>
        );
    } else if (this.props.item == "DOIInfix") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>A DOI contains 3 components. The prefix, which is assigned by the registration agency, begins with 10.xxx; the infix, which can contain intelligence, such as the name of the journal, repository or project; the suffix, which is assigned by the allocation agency. Example: 10.00000/OSTIDOE CODE/170000</span>
        );
    } else if (this.props.item == "Identifier") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Provide the Digital Object Identifier (DOI) or URL for the related item(s).</span>
        );
    } else if (this.props.item == "IdentifierType") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Identifiers used must be Digital Object Identifiers (DOIs) or URLs.</span>
        );
    } else if (this.props.item == "Keywords") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>
            A list of words or phrases that describe the software. Keywords aide in the online search and discovery of information about the software. More than one keyword may be entered. Separate terms with a semicolon.
          </span>
        );
    } else if (this.props.item == "License") {
      returnData = (shortTooltip)
        ? (
          <span>Select the appropriate license from the drop-down menu of available options.</span>
        )
        : (
          <span>Select the appropriate license from the drop-down menu of available options. Descriptions of Licenses are available&nbsp;
            <a title='Open Source Alphabetical' href='https://opensource.org/licenses/alphabetical'>here</a>
          </span>
        );
    } else if (this.props.item == "OpenSourceNotPublic") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Code is Open Source, but is not yet available in a public repository. Interested users can contact the developer(s) or responsible parties for information regarding access and (re)use. A landing page URL is required for submitting Open Source, no Publicly available repository code; the URL should provide additional information on how to obtain access to the code.</span>
        );
    } else if (this.props.item == "OpenSourcePublic") {
      returnData = (shortTooltip)
        ? (
          <span>Software can be freely accessed, used, changed and shared (in modified or unmodified form) by anyone in a public repository. Open Source software is made by many people, and distributed under licenses that comply with the Open Source Definition.</span>
        )
        : (
          <span>Software can be freely accessed, used, changed and shared (in modified or unmodified form) by anyone in a public repository. Open Source software is made by many people, and distributed under licenses that comply with the Open Source Definition. See the <a title='Open Source Initiative' href='https://opensource.org/'>Open Source Initiative</a> for more information and definitions.</span>
        );
    } else if (this.props.item == "OtherSpecialRequirements") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Information regarding hardware or software requirements.
          </span>
        );
    } else if (this.props.item == "PublishRecord") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>After required fields are completed, submit record to DOE Code</span>
        );
    } else if (this.props.item == "RelatedIdentifier") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>DOI or URL identifiers of related resources. Referencing other documents, datasets, or software that relate to the submitted software allows users to follow these vital links and to better understand the scope of your research.</span>
        );
    } else if (this.props.item == "RelationType") {
      returnData = (shortTooltip)
        ? (
          <span>Provide, with controlled vocabulary, the relationship of the resource being registered and the related resource. The Relation Type field also allows you to define how the submitted software is related to the DOI you enter and the document you are submitting.
          </span>
        )
        : (
          <span>Provide, with controlled vocabulary, the relationship of the resource being registered and the related resource. The Relation Type field also allows you to define how the submitted software is related to the DOI you enter and the document you are submitting. For definitions of each relation type controlled vocabulary see&nbsp;<a title='Datacite Metadata Kernel' href='https://schema.datacite.org/meta/kernel-4.0/doc/DataCite-MetadataKernel_v4.0.pdf'>this</a>.</span>
        );
    } else if (this.props.item == "ReleaseDate") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Select the software release date.</span>
        );
    } else if (this.props.item == "RepositoryInfo") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>You must provide a URL in order to proceed. If you do not have a URL, please go to&nbsp;
            <a title='DOE Code Repository' href='#'>DOE Code</a>&nbsp; and select Create a Repository.</span>
        );
    } else if (this.props.item == "RepositoryLink") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>If you select Open Source, publicly available you must provide a unique URL which leads to the actual code repository. Please ensure you are providing the direct URL to the actual repository. As an example, the direct repository URL for DOE CODE is https://www.github.com/doecode/doecode whereas the project landing page is https://www.github.com/doecode.</span>
        );
    } else if (this.props.item == "ResearchOrg") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>The research organization, such as a DOE national laboratory or university, which had primary responsibility for developing the software.</span>
        );
    } else if (this.props.item == "ResearchOrgDOEOrg") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Check the box if the research organization is associated with the Department of Energy.</span>
        );
    } else if (this.props.item == "ResearchOrgName") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>The name of the research organization. If the research organization is within the Department of Energy, please select from the list of DOE organizations. Other research organization names will be freeform.</span>
        );
    } else if (this.props.item == "ReserveDoi") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>If a DOI has not yet been minted for the software, use Reserve DOE so that OSTI will assign a persistent identifier before you submit. Please note, your reserved DOI will not be registered with DataCite until a Release Date is provided.</span>
        );
    } else if (this.props.item == "SaveProgress") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>An incomplete record can be saved at any time, for future completion and publish</span>
        );
    } else if (this.props.item == "ShortTitle") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Abbreviated title or acronym for the software.</span>
        );
    } else if (this.props.item == "SiteAccessionNumber") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>The accession or other identifying numbers assigned by the submitting site, university, or repository's database, records, etc.
          </span>
        );
    } else if (this.props.item == "SoftwareTitle") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>The title of the software.</span>
        );
    } else if (this.props.item == "SponsoringOrg") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>The sponsoring or funding office of the software product.
          </span>
        );
    } else if (this.props.item == "SponsorOrgAdditionalRewards") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Other award/contract numbers that represent funding contributed to the project, including other DOE awards or awards from other government agencies, foundations, etc.</span>
        );
    } else if (this.props.item == "SponsorOrgBRClassification") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>A Budget and Reporting (B&amp;R) code is given to a project by the Department of Energy. The structure of a B&amp;R code parallels approved DOE PPAs (Program, Project or Activities). The code is used for executing the budget; reporting actual obligations, costs, and revenues; and controlling and measuring actual versus budgeted performance.</span>
        );
    } else if (this.props.item == "SponsorOrgContractNumber") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>DOE award/contract number that is largely responsible for funding the project. At least one valid entry is required for Submittal.</span>
        );
    } else if (this.props.item == "SponsorOrgDOEOrg") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Check this box if the Sponsoring Organization you are entering is an organization within the Department of Energy.</span>
        );
    } else if (this.props.item == "SponsorOrgFWPNum") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>Field Work Proposal number. A number given to a proposal from a DOE laboratory by the Department of Energy.
          </span>
        );
    } else if (this.props.item == "SponsorOrgName") {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>
            The name of the sponsoring or funding organization. If the sponsoring or funding organization is from the Department of Energy, please choose from the list of DOE organizations. Other sponsoring organization names will be freeform.</span>
        );
    } else if (this.props.item == 'LandingPage') {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>
            If you select&nbsp;
            <strong>Open Source</strong>,&nbsp;
            <strong>no publicly available repository</strong> OR&nbsp;
            <strong>Closed Source</strong> you must provide a unique URL which leads to the landing page of the software. The landing page should provide information regarding how to access the source code, point of contact, and licensing information.
          </span>
        );
    } else if (this.props.item == 'FileUpload') {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>
            If you are submitting Open Source, No Publicly Available Repository or Close Source code through DOE CODE you will also be required to upload an archive file containing your source code. This will be used for archiving purposes. Supported file types include: .zip, .tar, .tar.gz, and .tar.gz2.</span>
        );
    } else if (this.props.item == 'ContractNumber') {
      returnData = (shortTooltip)
        ? (
          <span></span>
        )
        : (
          <span>
            Please supply your current DOE award/contract number, which can be found in your DOE award package. DOE CODE will validate the number automatically.
          </span>
        );
    }
    /*Okay, the text we just got, we'll do something with it now*/
    return (
      <span>
        {this.props.justText !== undefined && <span>
          {returnData}
        </span>}
        {this.props.justText === undefined && <span>
          <span data-tip data-for={this.props.item}>
            <span className='fa fa-question-circle help-question-mark'></span>
          </span>
          <ReactTooltip id={this.props.item} aria-haspopup='true' role='example'>
            <div className='help-box'>
              {returnData}
            </div>
          </ReactTooltip>
        </span>}

      </span>
    );
  }
}
