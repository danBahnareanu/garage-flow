import { Colors } from '@/constants/colors';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Extra styling for the sheet container (padding, minHeight, maxHeight, ...) */
  contentStyle?: StyleProp<ViewStyle>;
  /** 'full': drag anywhere on the sheet. 'handle': drag only the top handle strip
   *  (use for sheets with scrollable content or forms). */
  dragArea?: 'full' | 'handle';
  /** Wrap in a KeyboardAvoidingView (for sheets containing text inputs) */
  avoidKeyboard?: boolean;
  /** Render as an absolute overlay instead of a native Modal (for sheets that
   *  must coexist with another native Modal) */
  asOverlay?: boolean;
  /** Tapping the dimmed backdrop closes the sheet (default true) */
  closeOnBackdropPress?: boolean;
  /** Full-screen overlay components (pickers, context menus, ...) rendered
   *  above the sheet, inside the same native Modal */
  overlayChildren?: React.ReactNode;
  /** Called once the sheet is fully closed and its native Modal dismissed.
   *  Open a follow-up modal here — opening one while this modal is still
   *  dismissing gets it torn down along with this modal on iOS. */
  onClosed?: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 800;

export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  visible,
  onClose,
  children,
  contentStyle,
  dragArea = 'handle',
  avoidKeyboard = false,
  asOverlay = false,
  closeOnBackdropPress = true,
  overlayChildren,
  onClosed,
}) => {
  // Keep mounted while the close animation plays
  const [shown, setShown] = useState(visible);
  const progress = useSharedValue(0);
  const dragY = useSharedValue(0);
  const onClosedRef = useRef(onClosed);
  onClosedRef.current = onClosed;
  const wasOpenRef = useRef(false);

  const notifyClosed = () => {
    if (!wasOpenRef.current) return;
    wasOpenRef.current = false;
    onClosedRef.current?.();
  };

  useEffect(() => {
    if (shown) {
      wasOpenRef.current = true;
      return;
    }
    // On iOS the native Modal reports dismissal via onDismiss; elsewhere the
    // unmount commit is the closest signal we have
    if (asOverlay || Platform.OS !== 'ios') {
      notifyClosed();
    }
  }, [shown]);

  useEffect(() => {
    if (visible) {
      setShown(true);
      dragY.value = 0;
      progress.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      progress.value = withTiming(
        0,
        { duration: 250, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(setShown)(false);
        },
      );
    }
  }, [visible]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value * 0.5,
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: (1 - progress.value) * SCREEN_HEIGHT + dragY.value },
    ],
  }));

  const panGesture = Gesture.Pan()
    .activeOffsetY(12)
    .failOffsetY(-12)
    .onUpdate((e) => {
      dragY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (dragY.value > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
        runOnJS(onClose)();
      } else {
        dragY.value = withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
      }
    });

  const dragHandle = (
    <View style={styles.dragZone}>
      <View style={styles.handleBar} />
    </View>
  );

  const sheet =
    dragArea === 'full' ? (
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sheet, contentStyle, sheetAnimatedStyle]}>
          {dragHandle}
          {children}
        </Animated.View>
      </GestureDetector>
    ) : (
      <Animated.View style={[styles.sheet, contentStyle, sheetAnimatedStyle]}>
        <GestureDetector gesture={panGesture}>{dragHandle}</GestureDetector>
        {children}
      </Animated.View>
    );

  const body = (
    <View style={styles.root}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={closeOnBackdropPress ? onClose : undefined}
      >
        <Animated.View style={[styles.overlayBackground, overlayAnimatedStyle]} />
      </Pressable>
      {sheet}
      {overlayChildren}
    </View>
  );

  const content = (
    <GestureHandlerRootView style={styles.flex}>
      {avoidKeyboard ? (
        <KeyboardAvoidingView style={styles.flex} behavior="padding">
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </GestureHandlerRootView>
  );

  if (asOverlay) {
    if (!shown) return null;
    return <View style={StyleSheet.absoluteFill}>{content}</View>;
  }

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={shown}
      onRequestClose={onClose}
      onDismiss={notifyClosed}
    >
      {content}
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dragZone: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    alignSelf: 'stretch',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});
