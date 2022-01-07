module.exports = function(buffer) {

  let uint8Array = Uint8Array.from(buffer);

  return `
import 'dart:typed_data';

Uint8List byteData = Uint8List.fromList([
  ${uint8Array.join(',')}
]);
  `;
}
