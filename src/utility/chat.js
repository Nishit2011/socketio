const getMessageTime = (username, msg) => {
  console.log(username);
  return {
    username: username,
    text: msg,
    createdAt: new Date().getTime(),
  };
};

module.exports = getMessageTime;
