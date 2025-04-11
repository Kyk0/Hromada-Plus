async function isGovUser(user) {
    return true;
    // return user.account_type === 'gov';
    // TODO: validation
}
module.exports = { isGovUser };