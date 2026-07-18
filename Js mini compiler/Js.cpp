#include <iostream>
#include <string>
using namespace std;

int main()
{
    string line;

    cout << "Enter the JS code : ";
    getline(cin, line);

    // Check if it starts with console.log(
    if (line.find("console.log(") == 0)
    {
        // Extract text inside ()
        int start = line.find("(");
        int end = line.find(")");

        string content = line.substr(start + 1, end - start - 1);

        // Check if it is a string
        if (content[0] == '"' && content[content.length() - 1] == '"')
        {
            // Print without quotes
            cout << content.substr(1, content.length() - 2) << endl;
        }
        else
        {
            string num1 = "", num2 = "";
            char op;

            int i = 0;

            // Read first number
            while (isdigit(content[i]))
            {
                num1 += content[i];
                i++;
            }

            // Read operator
            op = content[i];
            i++;

            // Read second number
            while (i < content.length())
            {
                num2 += content[i];
                i++;
            }

            int a = stoi(num1);
            int b = stoi(num2);

            switch (op)
            {
                case '+':
                    cout << a + b << endl;
                    break;

                case '-':
                    cout << a - b << endl;
                    break;

                case '*':
                    cout << a * b << endl;
                    break;

                case '/':
                    if (b != 0)
                        cout << a / b << endl;
                    else
                        cout << "Division by Zero!" << endl;
                    break;

                default:
                    cout << "Invalid Operator" << endl;
            }
        }
    }
    else
    {
        cout << "Invalid JavaScript Statement" << endl;
    }

    return 0;
}