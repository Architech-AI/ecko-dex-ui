import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Input from '../../shared/Input';
import InputToken from '../../shared/InputToken';
import { SwapIcon } from '../../assets';
import { limitDecimalPlaces, reduceBalance } from '../../utils/reduceBalance';
import tokenData from '../../constants/cryptoCurrencies';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import { Divider } from 'semantic-ui-react';
import useWindowSize from '../../hooks/useWindowSize';
import { theme } from '../../styles/theme';
import noExponents from '../../utils/noExponents';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;

  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const SwapForm = ({ fromValues, setFromValues, toValues, setToValues, fromNote, toNote, setTokenSelectorType, setInputSide, swapValues }) => {
  const { gameEditionView } = useContext(GameEditionContext);
  const [rotation, setRotation] = useState(0);

  const [width] = useWindowSize();

  return (
    <Container>
      <Input
        error={isNaN(fromValues.amount)}
        topLeftLabel={fromNote ? `from ${fromNote}` : `from`}
        topRightLabel={`balance: ${reduceBalance(fromValues.balance) ?? '-'}`}
        placeholder="0.0"
        maxLength="15"
        size={width <= theme().mediaQueries.mobilePixel && gameEditionView ? 'medium' : 'large'}
        inputRightComponent={
          fromValues.coin ? (
            <InputToken
              icon={tokenData[fromValues.coin].icon}
              code={tokenData[fromValues.coin].name}
              onClick={() => {
                setTokenSelectorType('from');
              }}
              onClickButton={() => {
                setInputSide('from');
                setFromValues((prev) => ({
                  ...prev,
                  amount: reduceBalance(fromValues.balance),
                }));
              }}
              disabledButton={!fromValues.balance}
            />
          ) : null
        }
        withSelectButton
        numberOnly
        value={noExponents(fromValues.amount)}
        onSelectButtonClick={() => {
          setTokenSelectorType('from');
        }}
        onChange={async (e, { value }) => {
          setInputSide('from');
          setFromValues((prev) => ({
            ...prev,
            amount: limitDecimalPlaces(value, fromValues.precision),
          }));
        }}
      />
      {gameEditionView ? null : (
        <Divider horizontal style={{ zIndex: 1 }}>
          <SwapIcon
            id="swap-button"
            style={{ cursor: 'pointer', transform: `rotate(${rotation}deg)`, transition: 'width 0.3s, transform 0.3s' }}
            onClick={() => {
              swapValues();
              setRotation((prev) => prev + 180);
            }}
          />
        </Divider>
      )}
      <Input
        error={isNaN(toValues.amount)}
        topLeftLabel={toNote ? `to ${toNote}` : `to`}
        topRightLabel={`balance: ${reduceBalance(toValues.balance) ?? '-'}`}
        placeholder="0.0"
        size={width <= theme().mediaQueries.mobilePixel && gameEditionView ? 'medium' : 'large'}
        maxLength="15"
        inputRightComponent={
          toValues.coin ? (
            <InputToken
              icon={tokenData[toValues.coin].icon}
              code={tokenData[toValues.coin].name}
              onClick={() => setTokenSelectorType('to')}
              onClickButton={() => {
                setInputSide('to');
                setToValues((prev) => ({
                  ...prev,
                  amount: reduceBalance(toValues.balance),
                }));
              }}
              disabledButton={fromValues.amount === fromValues.balance}
            />
          ) : null
        }
        withSelectButton
        numberOnly
        value={noExponents(toValues.amount)}
        onSelectButtonClick={() => {
          setTokenSelectorType('to');
        }}
        onChange={async (e, { value }) => {
          setInputSide('to');
          setToValues((prev) => ({
            ...prev,
            amount: limitDecimalPlaces(value, toValues.precision),
          }));
        }}
      />
    </Container>
  );
};

export default SwapForm;
