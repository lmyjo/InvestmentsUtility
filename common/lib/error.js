module.exports = {
  getUnsuportedValueError: function getUnsuportedValue (property) {
    return {
      status: 422,
      message: '422 - Value for ' + property + ' is not alowed',
      error: '422 UNPROCESSABLE ENTITY'
    };
  },
  getOptionalNotPresentError: function getNotPresent (property) {
    return {
      status: 422,
      message: '422 - ' + property + ' field is expected',
      error: '422 UNPROCESSABLE ENTITY'
    };
  },
  getOperationError: function getOperation () {
    return {
      status: 400,
      message: '400 - Wrong operation'
    };
  }
};
