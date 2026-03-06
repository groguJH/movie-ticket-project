import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function useUpdateFeedback() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await axios.patch(`/api/profile/feedback/edit/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      // 수정 성공 후, 피드백 리스트를 다시 불러옵니다.
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
    },
  });
  return mutation;
}
