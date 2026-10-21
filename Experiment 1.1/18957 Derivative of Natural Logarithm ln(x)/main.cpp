#include <cstdio>

using namespace std;

int main() {
    int m;
    scanf("%d", &m);
    while (m--) {
        double x;
        scanf("%lf", &x);
        printf("%.2f\n", 1.0 / x);
    }
    return 0;
}
