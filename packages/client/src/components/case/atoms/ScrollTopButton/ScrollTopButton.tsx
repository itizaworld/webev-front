import { VFC } from 'react';
import styled from 'styled-components';

import { Icon } from '@monorepo/client/src/components/base/atoms/Icon';
import { BootstrapBreakpoints } from '@monorepo/client/src/libs/interfaces/variables';
import { useHooks } from './hooks';

export const ScrollTopButton: VFC = () => {
  const { scrollTop, isShowScroll } = useHooks();

  return (
    <StyledButton id="scroll-to-top" onClick={scrollTop} className={`btn btn-light btn-lg ${isShowScroll ? 'show' : ''}`}>
      <Icon icon="ARROW" color="SECONDARY" />
    </StyledButton>
  );
};

export const StyledButton = styled.button`
  position: fixed;
  right: 20px;
  bottom: 20px;
  opacity: 0;
  transition: opacity 0.4s;
  transition-duration: 200ms;
  transition-property: all;
  @media (min-width: ${BootstrapBreakpoints.md}px) {
    &.show {
      opacity: 0.5;
      &:hover {
        opacity: 0.7;
      }
    }
  }
`;