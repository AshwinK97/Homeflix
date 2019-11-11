import java.awt.Desktop;
import java.io.File;
import java.io.IOException;

import javax.swing.JFrame;

class Player {

    public static void main(String args[]) {
        JFrame window = new JFrame("Player");
        window.setSize(1280, 720);
        window.setResizable(false);
        window.setLocationRelativeTo(null);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setVisible(true);

        try {
            Desktop.getDesktop().open(new File("Apex.mp4"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}