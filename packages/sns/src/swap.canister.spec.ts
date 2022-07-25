import type { ActorSubclass } from "@dfinity/agent";
import { mock } from "jest-mock-extended";
import type { Swap, _SERVICE as SnsSwapCanister } from "../candid/sns_swap";
import { GetStateResponse } from "../candid/sns_swap";
import { swapCanisterIdMock } from "./mocks/sns.mock";
import { SwapCanister } from "./swap.canister";

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

    const service = mock<ActorSubclass<SnsSwapCanister>>();
    service.get_state.mockResolvedValue(mockResponse);

    const canister = SwapCanister.create({
      canisterId: swapCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const res = await canister.state({});
    expect(res).toEqual(mockResponse);
  });

  it("should call to notify the buyer tokens", async () => {
    const service = mock<ActorSubclass<SnsSwapCanister>>();
    service.refresh_buyer_tokens.mockResolvedValue({});

    const canister = SwapCanister.create({
      canisterId: swapCanisterIdMock,
      certifiedServiceOverride: service,
    });
    await canister.notifyParticipation({ buyer: "aaaaa-aa" });
    expect(service.refresh_buyer_tokens).toHaveBeenCalledWith({
      buyer: "aaaaa-aa",
    });
  });
});
