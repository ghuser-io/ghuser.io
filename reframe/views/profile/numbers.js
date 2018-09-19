const roundHalf = num => Math.round(num * 2) / 2;

const bigNum = num => {
  let suffix='';
  let val = roundHalf(num);
  if (val >= 1000) {
    suffix = 'k';
    val = roundHalf(val / 1000);
  }
  if (val >= 10) {
    val = Math.round(val);
  }
  return `${val}${suffix}`;
};

export {
  roundHalf,
  bigNum,
  numberOf,
};

function numberOf(n, what, abbreviate) {
  return (
    (abbreviate?bigNum(n):n)+
    ' '+
    what+
    (n===1 ? '' : 's')
  );
}
