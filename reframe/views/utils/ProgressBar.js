import React from 'react';

export {ProgressBar};

function ProgressBar({percentage, style}) {
  const borderRadius = 5;
  return (
    <div style={{
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      height: 7,
      width: 55,
      borderRadius,
      display: 'inline-block',
      ...style,
    }}>
      <div style={{
        width: percentage+'%',
        backgroundColor: '#21ba45',
        borderTopLeftRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
        position: 'absoute',
        top: 0,
        left: 0,
        height: '100%',
      }}/>
    </div>
  );
}
