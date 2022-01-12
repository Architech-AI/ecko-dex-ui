import React, { createContext, useEffect, useState } from 'react';

export const GameEditionContext = createContext(null);

const initialModalState = {
  open: false,
  title: null,
  description: null,
  content: null,
};

export const PROGRESS_BAR_MAX_VALUE = 89;
export const WIRE_CONTAINER_WIDTH = 930;
export const GameEditionProvider = (props) => {
  const [gameEditionView, setGameEditionView] = useState(true);
  const [modalState, setModalState] = useState(initialModalState);
  const [isSwapping, setIsSwapping] = useState(false);

  const [loadingValue, setLoadingValue] = useState(1);
  const [showWires, setShowWires] = useState(false);
  const [selectedWire, setSelectedWire] = useState(false);

  useEffect(() => {
    let interval = null;
    if (gameEditionView) {
      interval = setInterval(() => setLoadingValue(PROGRESS_BAR_MAX_VALUE), 1000);
    }
    return () => {
      clearInterval(interval);
      setLoadingValue(1);
    };
  }, [gameEditionView]);

  const openModal = (settings) => {
    setModalState((prev) => ({ ...prev, ...settings, open: true }));
  };

  const closeModal = () => {
    setModalState(initialModalState);
  };

  const onWireSelect = (wire) => {
    setShowWires(false);
    setSelectedWire(wire);
  };

  return (
    <GameEditionContext.Provider
      value={{
        gameEditionView,
        setGameEditionView,
        modalState,
        setModalState,
        openModal,
        closeModal,
        isSwapping,
        setIsSwapping,
        loadingValue,
        showWires,
        setShowWires,
        selectedWire,
        onWireSelect,
      }}
    >
      {props.children}
    </GameEditionContext.Provider>
  );
};
