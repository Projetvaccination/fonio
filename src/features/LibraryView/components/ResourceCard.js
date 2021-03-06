/* eslint react/no-danger : 0 */
/* eslint react/prefer-stateless-function : 0 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// import resourceSchema from 'quinoa-schemas/resource';

import AssetPreview from '../../../components/AssetPreview';

import {
  abbrevString
} from '../../../helpers/misc';


import {
  Column,
  Columns,

  Icon,
  Button,
  StatusMarker,
  Title,
  Card,
} from 'quinoa-design-library/components';

import icons from 'quinoa-design-library/src/themes/millet/icons';
import './ResourceCard.scss';
import {translateNameSpacer} from '../../../helpers/translateUtils';

class ResourceCard extends Component {
  render = () => {
    const {
      props: {
        resource,
        lockData,
        getTitle,
        onEdit,
        onDelete,
        isActive,
        onClick,
        isSelectable,
        onSetCoverImage,
        coverImageId,
      },
      context: {
        t,
        // getResourceDataUrl
      }
    } = this;
    const {
        data,
        metadata = {}
      } = resource;

      const {
        type,
        // source,
      } = metadata;

      const translate = translateNameSpacer(t, 'Features.LibraryView');

      // const specificSchema = resourceSchema.definitions[type];


      let title;
      if (type === 'bib' && data && data[0]) {
        // const bibData = {
        //   [data[0].id]: data[0]
        // };
        // resourceTitle = <Bibliography items={bibData} style={apa} locale={english} />;
        title = <div className="bib-wrapper" dangerouslySetInnerHTML={{__html: data[0].htmlPreview}} />;
      }
      else title = abbrevString(getTitle(resource) || translate('untitled resource'), 40);

      let cardSize;
      switch (resource.metadata.type) {
        // case 'image':
        // case 'table':
        // case 'video':
        // case 'embed':
        //   cardSize = {
        //     mobile: 12,
        //     tablet: 6,
        //     desktop: 8,
        //     widescreen: 8,
        //   };
        //   break;
        default:
          cardSize = {
            mobile: 12,
            tablet: 6,
            desktop: 4,
            widescreen: 4,
          };
          break;
      }
      const url = resource.data.url || Array.isArray(resource.data) && resource.data[0] && resource.data[0].URL;
      return (
        <Column
          isSize={cardSize}>
          <Card
            isSelectable={isSelectable}
            isActive={isActive}
            onClick={onClick}
            bodyContent={
              <div className="fonio-ResourceCard" style={{cursor: lockData ? undefined : 'pointer'}}>
                <Columns style={{marginBottom: 0}}>
                  <Column isSize={2}>
                    <Icon isSize="medium" isAlign="left">
                      <img src={icons[type].black.svg} />
                    </Icon>
                  </Column>

                  <Column style={{transition: 'none'}} isSize={8}>
                    <Title style={{paddingTop: '.5rem'}} isSize={6}>
                      <span>
                        {title}
                        {
                            ['webpage', 'video'].includes(resource.metadata.type) ?
                              <a
                                style={{marginLeft: '.5rem'}} onClick={e => e.stopPropagation()} target="blank"
                                href={url}>
                                <Icon icon="external-link" />
                              </a>
                            :
                              null
                          }

                      </span>
                      <StatusMarker
                        style={{marginLeft: '1rem'}}
                        lockStatus={lockData ? 'locked' : 'open'}
                        statusMessage={lockData ? translate('edited by {a}', {a: lockData.name}) : translate('open to edition')} />
                    </Title>
                  </Column>
                </Columns>
                {!['webpage', 'glossary', 'bib'].includes(resource.metadata.type) && <Columns>
                  <Column style={{position: 'relative'}} isSize={12}>
                    <div style={{maxWidth: '100%', overflow: 'hidden', maxHeight: '20rem'}}>
                      <AssetPreview resource={resource} silentPreviewClick={false} />
                    </div>
                  </Column>
                  </Columns>}
                <Columns>
                  <Column style={{paddingTop: 0}} isOffset={2} isSize={7}>
                    <Button
                      onClick={onEdit}
                      isDisabled={lockData}
                      data-place="left"
                      data-effect="solid"
                      data-for="tooltip"
                      data-tip={translate('settings')}>
                      <Icon isSize="small" isAlign="left">
                        <img src={icons.settings.black.svg} />
                      </Icon>
                    </Button>

                    <Button
                      onClick={onDelete}
                      isDisabled={lockData}
                      data-place="left"
                      data-effect="solid"
                      data-for="tooltip"
                      data-tip={translate(`delete this ${type}`)}>
                      <Icon isSize="small" isAlign="left">
                        <img src={icons.remove.black.svg} />
                      </Icon>
                    </Button>

                    {type === 'image' &&
                      <Button
                        onClick={e => {
                          e.stopPropagation();
                          onSetCoverImage(resource.id);
                        }}
                        data-place="left"
                        data-effect="solid"
                        data-for="tooltip"
                        isColor={coverImageId === resource.id ? 'info' : undefined}
                        data-tip={translate('use as cover image')}>
                        <Icon isSize="small" isAlign="left">
                          <img src={icons.cover.black.svg} />
                        </Icon>
                      </Button>
                    }
                  </Column>
                </Columns>
              </div>
              } />
        </Column>
      );
  }
}


ResourceCard.contextTypes = {
  t: PropTypes.func.isRequired,
  getResourceDataUrl: PropTypes.func
};


export default ResourceCard;
