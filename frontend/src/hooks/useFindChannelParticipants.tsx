import { findChannelByParticipants } from "@/api/channelApi";
import { useChannelStore } from "@/store/useChannelStore";
import {
  DeviceType,
  MAX_CHANNELS_DESKTOP,
  MAX_CHANNELS_MOBILE,
  MAX_CHANNELS_TABLET,
} from "@/utils/constants";
import { getDeviceType } from "@/utils/getDeviceType";
import { useMutation } from "@tanstack/react-query";

export function useFindChannelParticipants() {
  const { channels, setChannels, chatBoxChannels, setChatBoxChannels } =
    useChannelStore();
  return useMutation({
    mutationFn: findChannelByParticipants,
    onSuccess: (data) => {
      const channel = data.data;

      // Kiểm tra nếu đã tồn tại → không thêm nữa
      const isExists =
        channels.some((c) => c.channel_id === channel.channel_id) ||
        chatBoxChannels.some((c) => c.channel_id === channel.channel_id);
      if (isExists) return;

      const device = getDeviceType();
      let maxChannels = MAX_CHANNELS_DESKTOP;
      if (device === DeviceType.Mobile) {
        maxChannels = MAX_CHANNELS_MOBILE;
      } else if (device === DeviceType.Tablet) {
        maxChannels = MAX_CHANNELS_TABLET;
      }
      // Tính tổng số channel đang có
      const totalCount = channels.length + chatBoxChannels.length;

      if (totalCount >= maxChannels) {
        // 👉 Nếu đã đạt max, loại bỏ 1 channel cũ trước khi thêm mới

        if (chatBoxChannels.length > 0) {
          // Ưu tiên loại trong chatBoxChannels (giống popup Messenger)
          setChatBoxChannels((prev) => prev.slice(1));
        } else if (channels.length > 0) {
          // Nếu không có chatbox thì loại từ channels
          setChannels((prev) => prev.slice(1));
        }
      }

      // Thêm channel mới vào chatBoxChannels
      setChatBoxChannels((prev) => [...prev, channel]);
    },
  });
}
