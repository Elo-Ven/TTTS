package app;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import org.apache.commons.io.FilenameUtils;
import java.util.List;
import java.util.ArrayList;
import java.util.Scanner;
import java.io.IOException;
import java.io.PrintWriter;
import javax.swing.JOptionPane;

public class App 
{
    public static void main( String[] args )
    {
        System.out.println(" ____  ____  ____  ____ ");
        System.out.println("(_  _)(_  _)(_  _)/ ___)");
        System.out.println("  )(    )(    )(  \\___ \\");
        System.out.println(" (__)  (__)  (__) (____/");
        System.out.println("  Twine Text To Speech");
        System.out.println(" ");
        System.out.println(" ");
        System.out.println("Beginning installation...");
        System.out.println(" ");

        String oldStr = "</head>";
        String newStr = "<script src='ttts/core/ttts.js'></script></head>";
        String source = "example.html";
        String output = "example-ttts.html";
        String ext1 = ".html";
        String ext2 = ".backup.html";
        String gameDir = "./Docs";


        // Find available html files
        File folder = new File(gameDir);
        File[] listOfFiles = folder.listFiles();
        
        String dialog = "Which Game File would you like to mod?\n\n";
        List<String> temp = new ArrayList<String>();
        for (int i = 0; i < listOfFiles.length; i++) {
            if (listOfFiles[i].isFile()) {
                String filename = listOfFiles[i].getName();
                String extension = FilenameUtils.getExtension(filename);
                if(extension.contains("html")){
                    temp.add(filename);
                    System.out.println("File "+i+": " + filename);
                    dialog = dialog+"File "+i+": " + filename+"\n";
                }
            }
        }
        String [] files = temp.toArray( new String[ temp.size() ] );

        
        if(files.length <= 0){
            dialog = "No .html files gave in this directory\n";
            dialog = dialog+"No .html files gave in this directory\n";
            JOptionPane.showMessageDialog(null, dialog);
            System.exit(0);
        }

        String fileNumS = JOptionPane.showInputDialog(null, dialog);
        int fileNum = Integer.valueOf(fileNumS);
        if(files.length <= fileNum || files[fileNum] == null){
            dialog = "Game File "+fileNum+" Not Found";
            JOptionPane.showMessageDialog(null, dialog);
            System.exit(0);
        }
        //System.out.println(input);

        //ask which file to use, unless there is only 1 html file
        // Scanner reader1 = new Scanner(System.in); 
        // System.out.println("Enter the file number: ");
        // int n = reader1.nextInt();
        // reader1.close();

        //set the modded game filename
        source = gameDir+"/"+listOfFiles[fileNum].getName();
        String srcBackup = source.replace(ext1, ext2);

        System.out.println(" ");
        System.out.println("Fetching game file...");
        System.out.println(source);
        
        //String content = new String(Files.readAllBytes(source), charset);
        try {
            //read the game file
            Path path = Paths.get(source);
            Charset charset = StandardCharsets.UTF_8;
            String content = new String(Files.readAllBytes(path), charset);
            
            System.out.println(" ");
            System.out.println("Backing up game file...");
            System.out.println(srcBackup);

            //create backup
            PrintWriter backup = new PrintWriter(srcBackup);
            backup.println(content);
            backup.close(); 

            System.out.println(" ");
            System.out.println("Import TTTS into game file...");

            content = content.replace(oldStr,newStr);
            PrintWriter main = new PrintWriter(source);
            main.println(content);
            main.close();
        }
        catch(IOException e) {
            e.printStackTrace();
        }
        
        //content = content.replaceAll(oldStr, newStr);
        //Files.write(path, content.getBytes(charset));

        //save the modded version of the game to a new file and leave the main file intact
        System.out.println("Saving modded game file...");
        System.out.println(output);

        //extra info
        System.out.println(" ");
        System.out.println("Installation complete...");
        System.out.println("Open the game using this file: ");
        System.out.println(" ");

        dialog = "Installation complete.\n\n";
        dialog = dialog+"Game file is now modded.";
        JOptionPane.showMessageDialog(null, dialog);
    }
}