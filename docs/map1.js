'use strict';
const c = async() => {
  const {hash:a, port:b} = window.location;
  return {hash:a, port:b};
};
(async() => {
  const a = await c();
  console.log(a);
})();


//# sourceMappingURL=map1.js.map