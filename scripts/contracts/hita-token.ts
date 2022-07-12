import { ethers } from 'hardhat';
import { Contract, ContractFactory } from "ethers";

export class HitaToken {
    static CONTRACT_FILE = 'HitaToken';
    static async deploy() {
        const tokenFactory: ContractFactory = await ethers.getContractFactory(HitaToken.CONTRACT_FILE);
        const token: Contract = await tokenFactory.deploy();
        await token.deployed();
        console.log(`${HitaToken.CONTRACT_FILE} deployed to: `, token.address);
    }
}