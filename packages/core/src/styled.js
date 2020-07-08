import { IS_STYLED_COMPONENT, SOURCE_AFTER } from '@filbert-js/types';

import React from 'react';
import { StyleSheetContext } from '@filbert-js/style-sheet-context';
import { ThemeContext } from '@filbert-js/theming';
import { hash } from './hash';
import htmlTags from 'html-tags';
import { interpolate } from './interpolate';
import { useStylesheet } from './hooks';

let id = 1;
function componentFactory({
  Component,
  options = {},
  styleTemplates,
  variables,
}) {
  function StyledComponent(props) {
    const theme = React.useContext(ThemeContext);
    const stylesheet = React.useContext(StyleSheetContext);

    const [styles, keyframes] = interpolate(styleTemplates, variables, {
      ...props,
      theme,
    });
    keyframes.forEach((frame) => stylesheet.createKeyframes(frame));
    const id = hash(styles, options.label);

    useStylesheet({
      hash: id,
      styles: styles,
      sourceAfter: props[SOURCE_AFTER],
      label: StyledComponent.label,
    });
    const { className, [SOURCE_AFTER]: sourceAfter, ..._props } = props;

    const extraProps = Object.assign(
      {
        className: [className, id].join(' ').trim(),
        [SOURCE_AFTER]: Component[IS_STYLED_COMPONENT] ? id : undefined,
      },
      _props,
    );
    return <Component {...extraProps} />;
  }
  StyledComponent[IS_STYLED_COMPONENT] = true;
  if (options.label) {
    StyledComponent.label = options.label;
  } else {
    StyledComponent.label = id;
  }
  id++;
  return StyledComponent;
}
export function styled(Component, options = {}) {
  return (styleTemplates, ...variables) =>
    componentFactory({ Component, options, styleTemplates, variables });
}

htmlTags.forEach((Component) => {
  styled[Component] = (styleTemplates, ...variables) =>
    componentFactory({ Component, styleTemplates, variables });
});
