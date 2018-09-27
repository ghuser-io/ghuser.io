const roundHalf = num => Math.round(num * 2) / 2;

const bigNum = num => {
  let suffix='';
  let val = num;
  if (val >= 1000) {
    suffix = 'k';
    val /= 1000;
  }
  val = val >= 10 && Math.round(val) || roundHalf(val);
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
