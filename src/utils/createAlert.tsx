import { useState } from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

interface createAlertProps {
    title: string;
    desc?: string;
}

export default function createAlert({title, desc}: createAlertProps) {
    const [visible, setVisible] = useState(true);

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    let Alert = (
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>{title}</Dialog.Title>
            {desc && (
                <Dialog.Content>
                    <Text variant="bodyMedium">{desc}</Text>
                </Dialog.Content>
            )}
            <Dialog.Actions>
              <Button onPress={hideDialog}>Fechar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
    )

    return {Alert, showDialog};
}