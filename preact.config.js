module.exports = function(config) {
	config.devServer.proxy = [
		{
			// proxy requests matching a pattern:
			path: '/api/**',

			// where to proxy to:
			target: 'http://localhost:3000',
		}
	];
};