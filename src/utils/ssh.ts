import fse from 'fs-extra';
import * as os from 'node:os';
import * as path from 'node:path';
import * as util from 'util';
// @ts-expect-error module type loss
import SSHKeyGen = require('ssh-keygen');
// @ts-expect-error module type loss
import SSHConfig = require('ssh-config');

const SSHKeyGenAsync = util.promisify(SSHKeyGen);

const SSHDir = path.join(os.homedir(), '.ssh');
const SSHConfigPath = path.join(SSHDir, 'config');

export async function generateSSHKey(configId: string, userEmail: string) {
  const location = path.join(SSHDir, configId);
  return await SSHKeyGenAsync({ comment: userEmail, location, read: true });
}

export async function getSSHPublicKey(configId: string) {
  const SSHPublicKeyPath = path.join(SSHDir, `${configId}.pub`);
  const SSHPublicKeyFileExists = await fse.pathExists(SSHPublicKeyPath);
  if (!SSHPublicKeyFileExists) {
    throw new Error(`There is no SSH Public key for '${configId}'. Please generate it.`);
  }
  return await fse.readFile(SSHPublicKeyPath, 'utf-8');
}

export async function isSSHKeyExisted(configId: string) {
  return await fse.pathExists(path.join(SSHDir, `${configId}.pub`));
}

/**
 * save SSH Config to ~/.ssh/config
 */
export async function updateSSHConfig(
  configId: string,
  hostName: string,
  userName: string,
) {
  const SSHConfigExists = await fse.pathExists(SSHConfigPath);
  if (!SSHConfigExists) {
    const error = new Error(`The SSH config path: ${SSHConfigPath} does not exist.`);
    error.name = 'update-ssh-config';
    console.error(error);
    throw error;
  }
  const SSHConfigContent = await fse.readFile(SSHConfigPath, 'utf-8');
  const SSHConfigSections = SSHConfig.parse(SSHConfigContent);

  const newSSHConfigSection = {
    Host: hostName,
    HostName: hostName,
    User: userName,
    PreferredAuthentications: 'publickey',
    IdentityFile: path.join(SSHDir, `${configId}`),
  };
  const SSHConfigSectionIndex = findSSHConfigSectionIndex(SSHConfigSections, configId);
  if (SSHConfigSectionIndex > -1) {
    SSHConfigSections.splice(SSHConfigSectionIndex, 1);
  }
  SSHConfigSections.append(newSSHConfigSection);
  await fse.writeFile(SSHConfigPath, SSHConfig.stringify(SSHConfigSections));
  console.info('update-SSH-config', SSHConfigSections);
}


/**
 * find the SSH config index in ssh config array by the configName
 */
function findSSHConfigSectionIndex(SSHConfigSections: any[], configName: string) {
  const privateKeyPath = path.join(SSHDir, `${configName}`);

  const currentSSHConfigIndex = SSHConfigSections.findIndex(({ config = [] }) => {
    return config.some(({ param, value }: any) => {
      return param === 'IdentityFile' && value.replace('~', os.homedir()) === privateKeyPath;
    });
  });

  return currentSSHConfigIndex;
}
