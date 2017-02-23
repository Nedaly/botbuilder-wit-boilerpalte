module.exports = [
    (session, args, next) => {
        session.send ('Example Text');
        next ();
    },
    (session) => {
        session.send ('Second Example Text');
    }
];