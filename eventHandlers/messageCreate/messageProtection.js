module.exports = (message) => {
    // Bot protection logic
    if (message.author.bot) return true;
    return false;
};