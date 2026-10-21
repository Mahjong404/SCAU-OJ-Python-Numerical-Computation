#include <cstdio>
#include <cmath>

using namespace std;

int main() {
    int m;
    scanf("%d", &m);
    while (m--) {
        double x;
        scanf("%lf", &x);
        printf("%.14f\n", exp(x));
    }
    return 0;
}
