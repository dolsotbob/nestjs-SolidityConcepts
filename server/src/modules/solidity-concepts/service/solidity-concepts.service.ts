import { Injectable } from '@nestjs/common';
import { EthersService } from '../../ethers/ethers.service';
import { exceptions } from '../../../common/exceptions/exception.config';

@Injectable()
export class SolidityConceptsService {
  constructor(private readonly ethersService: EthersService) { }

  async getOwner() {
    try {
      // Todo: owner의 값을 리턴합니다.
      return await this.ethersService.owner();
    } catch (error) {
      //  Todo: 에러를 응답합니다.(exceptions.createBadRequestException(error.message))
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async fixedValue() {
    try {
      // Todo: fixedValue의 값을 리턴합니다.
      return await this.ethersService.fixedValue();
    } catch (error) {
      //  Todo: 에러를 응답합니다.(exceptions.createBadRequestException(error.message))
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async getValue() {
    try {
      // Todo: value의 값을 리턴합니다.
      return await this.ethersService.value();
    } catch (error) {
      //  Todo: 에러를 응답합니다.(exceptions.createBadRequestException(error.message))
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async checkValue(value: number) {
    try {
      // Todo: checkValue의 값을 리턴합니다.
      return await this.ethersService.checkValue(value);
    } catch (error) {
      //  Todo: 에러를 응답합니다.(exceptions.createBadRequestException(error.message))
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async sumValue(value: number) {
    try {
      // Todo: sumUpTo의값을 리턴합니다.
      return await this.ethersService.sumUpTo(value);
    } catch (error) {
      //  Todo: 에러를 응답합니다.(exceptions.createBadRequestException(error.message))
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async updateValue(value: number) {
    try {
      // Todo: updateValue의값을 리턴합니다.
      // ⚠️ bigint 타입은 JSON으로 변환 시 string으로 변환 필요
      const updatedValue = await this.ethersService.updateValue(value);
      // console.log(updatedValue);

      if (
        typeof updatedValue === 'object' &&
        updatedValue !== null &&
        'oldValue' in updatedValue &&
        'newValue' in updatedValue
      ) {
        const { oldValue, newValue } = updatedValue as {
          oldValue: bigint;
          newValue: bigint;
        };

        return {
          oldValue: oldValue.toString(),
          newValue: newValue.toString(),
        };
      }

      return updatedValue;
    } catch (error) {
      //  Todo: 에러를 응답합니다.(exceptions.createBadRequestException(error.message))
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async ownerFunction() {
    try {
      // Todo: ownerFunction의값을 리턴합니다.
      return await this.ethersService.ownerFunction();
    } catch (error) {
      /*
        Todo: 스마트 컨트랙트에서 발생한 오류 유형에 따라 예외를 정의합니다.

        - 예외: 컨트랙트에서 에러 처리를 응답으로 반환
          → ownerFunction 함수 호출 시 권한이 없는 address의 에러로 "Not the contract owner"가 반환된 경우
          → exceptions.NOT_THE_CONTRACT_OWNER 반환

          예시:
          error.reason === "Not the contract owner"

        - 예외: 그 외 오류들
          → exceptions.createBadRequestException(error.message)
      */
      if (error.reason === "Not the contract owner") {
        throw exceptions.NOT_THE_CONTRACT_OWNER;
      }
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async sendEther(address: string, value: number) {
    try {
      // Todo: sendEther의값을 리턴합니다.
      return await this.ethersService.sendEther(address, value);
    } catch (error) {
      //  Todo: 에러를 응답합니다.(exceptions.createBadRequestException(error.message))
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async getContractBalance() {
    try {
      // Todo: getContractBalance의 값을 리턴합니다.
      return await this.ethersService.getContractBalance();
    } catch (error) {
      //  Todo: 에러를 응답합니다.(exceptions.createBadRequestException(error.message))
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async deposit(value: number) {
    try {
      // Todo: deposit의 값을 리턴합니다.
      return await this.ethersService.deposit(value);
    } catch (error) {
      //  Todo: 에러를 응답합니다.(exceptions.createBadRequestException(error.message))
      throw exceptions.createBadRequestException(error.message);
    }
  }

  async withDraw() {
    try {
      // Todo: withDraw의값을 리턴합니다.
      return await this.ethersService.withDraw();
    } catch (error) {
      /*
        Todo: 스마트 컨트랙트에서 발생한 오류 유형에 따라 예외를 정의합니다.

        - 예외: 컨트랙트에서 에러 처리를 응답으로 반환
          → ownerFunction 함수 호출 시 권한이 없는 address의 에러로 "Not the contract owner"가 반환된 경우
          → exceptions.NOT_THE_CONTRACT_OWNER 반환

          예시:
          error.reason === "Not the contract owner"

        - 예외: 그 외 오류들
          → exceptions.createBadRequestException(error.message)
      */
      if (error.reason === "Not the contract owner") {
        throw exceptions.NOT_THE_CONTRACT_OWNER;
      }
      throw exceptions.createBadRequestException(error.message);
    }
  }
}
