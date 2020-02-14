const config = {
    dev: {
        server: 'https://4444-c545b848-69b3-474b-a60d-4322399be614.ws-ap01.gitpod.io'
    },
    prod: {
        server: ''
    }
}

const env = process.env.NODE_ENV === 'development' ? config.dev : config.prod

export default env
