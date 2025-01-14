import type { ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { mock } from "jest-mock-extended";
import type {
  BuyerState,
  GetStateResponse,
  Swap,
  _SERVICE as SnsSwapService,
} from "../candid/sns_swap";
import { swapCanisterIdMock } from "./mocks/sns.mock";
import { SnsSwapCanister } from "./swap.canister";

describe("Swap canister", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return the state of the swap canister", async () => {
    const mockSwap: Swap = {
      swap: [
        {
          init: {
            min_participants: 2,
          },
        },
      ],
    } as unknown as Swap;

    const mockResponse: GetStateResponse = {
      swap: [mockSwap],
      derived: [],
    };

    const service = mock<ActorSubclass<SnsSwapService>>();
    service.get_state.mockResolvedValue(mockResponse);

    const canister = SnsSwapCanister.create({
      canisterId: swapCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const res = await canister.state({});
    expect(res).toEqual(mockResponse);
  });

  it("should call to notify the buyer tokens", async () => {
    const service = mock<ActorSubclass<SnsSwapService>>();
    service.refresh_buyer_tokens.mockResolvedValue({
      icp_accepted_participation_e8s: BigInt(0),
      icp_ledger_account_balance_e8s: BigInt(0),
    });

    const canister = SnsSwapCanister.create({
      canisterId: swapCanisterIdMock,
      certifiedServiceOverride: service,
    });
    await canister.notifyParticipation({ buyer: "aaaaa-aa" });
    expect(service.refresh_buyer_tokens).toHaveBeenCalledWith({
      buyer: "aaaaa-aa",
    });
  });

  it("should return the user commitment", async () => {
    const buyerState: BuyerState = {
      icp: [
        {
          amount_e8s: BigInt(100000000),
          transfer_start_timestamp_seconds: BigInt(0),
          transfer_success_timestamp_seconds: BigInt(0),
        },
      ],
    };
    const service = mock<ActorSubclass<SnsSwapService>>();
    service.get_buyer_state.mockResolvedValue({
      buyer_state: [buyerState],
    });

    const canister = SnsSwapCanister.create({
      canisterId: swapCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const response = await canister.getUserCommitment({
      principal_id: [Principal.fromText("aaaaa-aa")],
    });
    expect(service.get_buyer_state).toBeCalled();
    expect(response).toEqual(buyerState);
  });
});
