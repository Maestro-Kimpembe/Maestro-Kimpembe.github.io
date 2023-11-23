#include <iostream>
using namespace std;
int Kilometry;
int main()
{
    cout << "Podaj o jaka liczbe przekroczyles predkosc:";
    cin >> Kilometry;
    if (Kilometry <= 10) {
        cout << "Jestes winny 100zl mandatu";
    }
    if ((Kilometry > 10)&&(Kilometry < 30)) {
        cout << "Jestes winny 200zl mandatu";
    }
    if (Kilometry > 30) {
        cout << "Jestes winny 400zl mandatu";
    }
    return 0;
}

