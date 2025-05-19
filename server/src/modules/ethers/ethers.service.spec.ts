import { Test, TestingModule } from '@nestjs/testing';
import { EthersService } from './ethers.service';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers');
  return {
    ...actual,
    ethers: {
      JsonRpcProvider: jest.fn().mockImplementation(() => ({})),
      Wallet: jest.fn().mockImplementation(() => ({
        address: '0xMockSigner',
      })),
      Contract: jest.fn().mockImplementation(() => mockContract),
    },
    zeroPadValue: jest.fn((data, len) => `padded(${data},${len})`),
  };
});

const mockWait = jest.fn().mockResolvedValue('receipt');

const mockContract = {
  owner: jest.fn().mockResolvedValue('0xOwnerAddress'),
  FIXED_VALUE: jest.fn().mockResolvedValue(100),
  value: jest.fn().mockResolvedValue(50),

  checkValue: jest.fn().mockImplementation((val: number) => {
    if (val > 100) return 'Value is greater than 100';
    if (val === 100) return 'Value is exactly 100';
    return 'Value is less than 100';
  }),

  sumUpTo: jest.fn().mockImplementation((val: number) => {
    return (val * (val + 1)) / 2;
  }),

  updateValue: jest.fn().mockResolvedValue({
    wait: jest.fn().mockResolvedValue({
      logs: [
        {
          topics: [],
          data: '',
        },
      ],
    }),
  }),

  interface: {
    parseLog: jest.fn().mockReturnValue({
      fragment: { name: 'ValueChanged' },
      args: [123, 456],
    }),
  },

  ownerFunction: jest.fn().mockResolvedValue('Hello, Owner!'),

  sendEther: jest.fn().mockResolvedValue({ wait: mockWait }),

  withDraw: jest.fn().mockResolvedValue({ wait: mockWait }),
  parseEther: jest.fn((value: string) => BigInt(Number(value) * 1e18)),

  getContractBalance: jest.fn().mockResolvedValue(BigInt(3e18)), // 여기 추가
};

describe('EthersService', () => {
  let service: EthersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EthersService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'RPC_URL') return 'https://mock.rpc';
              if (key === 'PRIVATE_KEY') return 'mockPrivateKey';
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EthersService>(EthersService);
  });

  it('owner()는 소유자 주소를 반환해야 합니다.', async () => {
    mockContract.owner = jest.fn().mockResolvedValue('0xOwnerAddress');
    expect(await service.owner()).toBe('0xOwnerAddress');
  });

  it('fixedValue()는 FIXED_VALUE 상수를 반환해야 합니다.', async () => {
    mockContract.FIXED_VALUE = jest.fn().mockResolvedValue(999);
    expect(await service.fixedValue()).toBe(999);
  });

  it('value()는 value 값을 반환해야 합니다.', async () => {
    mockContract.value = jest.fn().mockResolvedValue(123);
    expect(await service.value()).toBe(123);
  });

  it('checkValue()는 비교 결과 메시지를 반환해야 합니다.', async () => {
    mockContract.checkValue = jest
      .fn()
      .mockResolvedValue('Value is greater than 100');
    expect(await service.checkValue(101)).toBe('Value is greater than 100');
  });

  it('sumUpTo()는 누적 합계를 반환해야 합니다.', async () => {
    mockContract.sumUpTo = jest.fn().mockResolvedValue(5050);
    expect(await service.sumUpTo(100)).toBe(5050);
  });

  it('updateValue()는 이벤트에서 oldValue, newValue를 추출해 반환해야 합니다.', async () => {
    const fakeLog = {
      topics: [],
      data: '',
    };

    const mockParseLog = {
      fragment: { name: 'ValueChanged' },
      args: [123, 456],
    };

    // 로그 시뮬레이션
    mockContract.updateValue = jest.fn().mockResolvedValue({
      wait: jest.fn().mockResolvedValue({
        logs: [fakeLog],
      }),
    });

    // interface 모킹
    mockContract.interface = {
      parseLog: jest.fn().mockReturnValue(mockParseLog),
    };

    const result = await service.updateValue(456);
    expect(result).toEqual({ oldValue: 123, newValue: 456 });
  });

  it('ownerFunction()은 결과를 반환해야 합니다.', async () => {
    mockContract.ownerFunction = jest.fn().mockResolvedValue('ownerResult');
    expect(await service.ownerFunction()).toBe('ownerResult');
  });

  it('sendEther()는 트랜잭션 영수증을 반환해야 합니다.', async () => {
    mockContract.sendEther = jest.fn().mockResolvedValue({
      wait: mockWait,
    });

    const receipt = await service.sendEther('0xabc', 1);
    expect(receipt).toBe('receipt');
  });

  it('getContractBalance()는 ether 단위로 반환해야 합니다.', async () => {
    // 이 안쪽 수정
    const result = await service.getContractBalance();
    expect(result).toBe('3.0');
    expect(mockContract.getContractBalance).toHaveBeenCalled();
  });

  it('deposit()은 트랜잭션 영수증을 반환해야 합니다.', async () => {
    service['signer'].sendTransaction = jest.fn().mockResolvedValue({
      wait: mockWait,
    });

    const result = await service.deposit(1);
    expect(result).toBe('receipt');
  });

  it('withDraw()는 트랜잭션 영수증을 반환해야 합니다.', async () => {
    mockContract.withDraw = jest.fn().mockResolvedValue({
      wait: mockWait,
    });

    const result = await service.withDraw();
    expect(result).toBe('receipt');
  });
});