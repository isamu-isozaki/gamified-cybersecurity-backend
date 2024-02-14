const Docker = require("dockerode");

const docker = new Docker();

async function dockerList (req, res) {
    const containers = await docker.listContainers({
        all: true,
        filters: {
            label: ["heisenberg"]
        }
    });

    res.success(containers);
  }
  
  module.exports = { dockerList }