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
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
    },
  });
  return mutation;
}
