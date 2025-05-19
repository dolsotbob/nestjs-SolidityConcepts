import { ethers } from 'hardhat';
import { makeAbi } from './abiGenerator';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // Todo: deploy script를 구현하여 주세요.
  // ✅ 컨트랙트 가져오기
  const Contract = await ethers.getContractFactory("SolidityConcepts");

  // ✅ 배포
  const contract = await Contract.deploy();

  // ✅ 배포 완료 대기 (필요하면)
  await contract.waitForDeployment();

  // ✅ 주소 출력 
  console.log(`SolidityConcepts contract deployed at: ${contract.target}`);
  await makeAbi('SolidityConcepts', contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
