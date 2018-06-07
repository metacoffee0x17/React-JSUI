import React from 'react';

import compact from 'lodash/compact';
import styles from './styles';
import getCombinedVariants from './combined-variants';

import getKnobsForStyles from './get-knobs-for-styles';

import { boolean } from '@storybook/addon-knobs/react';

const Variants = ({ variants, knobs = true, defaultStyles, children }) => {
  const variantsList = Object.entries(variants).map(([key, variants]) => {
    return {
      name: key,
      variants: variants.map(({ name, prop }) => ({
        name,
        props: {
          [key]: prop
        }
      }))
    };
  });

  //create knobs

  const stylesFromKnobs = getKnobsForStyles(defaultStyles);

  //knobs for props
  const otherKnobs = variantsList.map(({ knob = true, name }) => boolean(name, knob, 'Variants'));
  const combinedKnob = boolean('Combined', false, 'Variants');
  const debugStyles = boolean('Debug styles', false, 'Styles');

  //filter variants based on knobs
  const list = compact(variantsList.filter((list, index) => otherKnobs[index] === true));

  //create a combined variant from the already filtered knobs
  const combinedVariant = {
    name: 'combined',
    variants: getCombinedVariants(list)
  };

  const allVariants = compact([...list, combinedKnob && combinedVariant]);

  const {
    spaceBetweenVariants,
    spaceBetweenGroups,
    columns,
    displayVariantName,
    displayGroupName,
    centerVariantName,
    hasPadding
  } = stylesFromKnobs;

  let stringifiedStyles = JSON.stringify(stylesFromKnobs, null, 2);
  return (
    <div style={styles.all({ hasPadding })}>
      {debugStyles && <textarea style={styles.debug()} value={stringifiedStyles} />}

      {allVariants.map((variantGroup, i) => (
        <div key={i} style={styles.variant({ variantSpace: spaceBetweenGroups })}>
          {displayGroupName && <div style={styles.title()}> {variantGroup.name} </div>}
          <div style={styles.inside({ hasPadding })}>
            <div style={styles.list({ columns, spacing: spaceBetweenVariants })}>
              {variantGroup.variants.map((variant, index) => (
                <div key={index} style={styles.variation({})}>
                  {displayVariantName && (
                    <div style={styles.name({ center: centerVariantName })}>{variant.name}</div>
                  )}
                  {children(variant, {
                    showCombined: combinedKnob,
                    groupName: variantGroup.name
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Variants;
